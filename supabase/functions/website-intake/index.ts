const ALLOWED_ORIGINS = new Set([
  'https://otto-plumbing-site.vercel.app',
  'https://otto-plumbing-site-ejns-projects-1b938dd2.vercel.app',
  'https://otto-plumbing-site-git-main-ejns-projects-1b938dd2.vercel.app'
]);

const SERVICES: Record<string, string> = {
  leak: 'Leak repair',
  drain: 'Drain / clog',
  fixtures: 'Toilet / faucet / fixture',
  heater: 'Water heater',
  installation: 'Plumbing installation',
  remodel: 'Remodel / construction',
  commercial: 'Commercial service',
  other: 'Other plumbing work',
  general: 'General plumbing'
};

const REQUIRED_ANSWERS: Record<string, string[]> = {
  leak: ['leakActive', 'leakWhere', 'leakShutoff'],
  drain: ['drainScope', 'drainFlow'],
  fixtures: ['fixtureType', 'fixtureNeed'],
  heater: ['heaterIssue', 'heaterType'],
  installation: ['installationType', 'propertyType'],
  remodel: ['remodelArea', 'remodelStage'],
  commercial: ['commercialNeed', 'commercialActive'],
  other: ['contextNote'],
  general: ['contextNote']
};

const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const DUP_WINDOW_MS = 2 * 60 * 1000;

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://otto-plumbing-site.vercel.app';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: cors(origin) });
}

function clean(value: unknown, max: number) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

function cleanDetails(value: unknown, max: number) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ').replace(/\r\n?/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
}

function cleanAnswers(value: unknown) {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const result: Record<string, string> = {};
  Object.keys(raw).slice(0, 20).forEach((key) => {
    if (!/^[A-Za-z][A-Za-z0-9]{0,39}$/.test(key)) return;
    const answer = clean(raw[key], 220);
    if (answer) result[key] = answer;
  });
  return result;
}

function phoneDigits(value: unknown) {
  let d = String(value ?? '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return d;
}

function validPhone(d: string) {
  return /^\d{10}$/.test(d) && !/^(\d)\1{9}$/.test(d) && !/^[01]/.test(d);
}

function validEmail(email: string) {
  return !email || (/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email) && !email.includes('..'));
}

function validPage(page: string) {
  if (!page) return true;
  try { return ALLOWED_ORIGINS.has(new URL(page).origin); }
  catch { return false; }
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function adminHeaders() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  let modern = '';
  try { modern = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default || ''; } catch (_) {}
  const key = modern || legacy;
  if (!key) throw new Error('missing_admin_key');
  const headers: Record<string, string> = { apikey: key, 'Content-Type': 'application/json', Accept: 'application/json' };
  if (legacy) headers.Authorization = `Bearer ${legacy}`;
  return headers;
}

async function recentWebsiteAlerts(sinceIso: string) {
  const base = Deno.env.get('SUPABASE_URL');
  if (!base) throw new Error('missing_supabase_url');
  const url = `${base}/rest/v1/alerts?select=data,created_at&created_at=gte.${encodeURIComponent(sinceIso)}&order=created_at.desc&limit=100`;
  const response = await fetch(url, { headers: adminHeaders() });
  if (!response.ok) throw new Error(`recent_alerts_${response.status}`);
  return await response.json();
}

async function insertRecord(table: 'alerts' | 'calls', id: string, data: Record<string, unknown>) {
  const base = Deno.env.get('SUPABASE_URL');
  if (!base) throw new Error('missing_supabase_url');
  const response = await fetch(`${base}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...adminHeaders(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id, data, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`insert_${table}_${response.status}:${(await response.text()).slice(0, 180)}`);
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: 'origin_not_allowed' }, 403, origin);

  const length = Number(req.headers.get('content-length') || '0');
  if (length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413, origin);

  let raw: any;
  try { raw = await req.json(); }
  catch { return json({ error: 'invalid_json' }, 400, origin); }

  const name = clean(raw?.name, 80);
  const digits = phoneDigits(raw?.phoneDigits || raw?.phone);
  const phone = clean(raw?.phone, 32) || digits;
  const email = clean(raw?.email, 120).toLowerCase();
  const explicitCategory = clean(raw?.category, 40).toLowerCase();
  const serviceKey = explicitCategory || clean(raw?.serviceKey, 40).toLowerCase();
  const guided = Boolean(explicitCategory);
  const service = SERVICES[serviceKey] || '';
  const address = clean(raw?.address || raw?.location, 180);
  const contactPreference = clean(raw?.contactPreference, 40);
  const answers = cleanAnswers(raw?.answers);
  const answersSummary = clean(raw?.answersSummary, 1600);
  const description = cleanDetails(raw?.description ?? raw?.details, 1200);
  const preferredDate = clean(raw?.preferredDate, 16);
  const preferredWindow = clean(raw?.preferredWindow, 40);
  const language = raw?.language === 'es' ? 'es' : 'en';
  const page = clean(raw?.page, 300);

  const errors: string[] = [];
  if (name.length < 2) errors.push('name');
  if (!validPhone(digits)) errors.push('phone');
  if (!validEmail(email)) errors.push('email');
  if (!service) errors.push('service');
  if (guided) {
    if (address.length < 3) errors.push('address');
    const required = REQUIRED_ANSWERS[serviceKey] || [];
    if (required.some((key) => !answers[key])) errors.push('answers');
  } else if (description.length < 10) {
    errors.push('details');
  }
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.push('preferredDate');
  if (!validPage(page)) errors.push('page');
  if (errors.length) return json({ error: 'invalid_fields', fields: errors }, 400, origin);

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown').split(',')[0].trim();
  const ipHash = await sha256(`otto-intake:${ip}`);
  const fingerprint = await sha256([
    name.toLowerCase(), digits, serviceKey, address.toLowerCase(), answersSummary.toLowerCase(),
    description.toLowerCase(), preferredDate, preferredWindow.toLowerCase()
  ].join('|'));

  try {
    const recent = await recentWebsiteAlerts(new Date(now - RATE_WINDOW_MS).toISOString());
    const website = Array.isArray(recent) ? recent.filter((row: any) => row?.data?.source === 'otto-plumbing-site' || row?.data?.requestSource === 'otto-plumbing-site') : [];
    const fromIp = website.filter((row: any) => row?.data?.ipHash === ipHash);
    if (fromIp.length >= RATE_MAX) return json({ error: 'rate_limited' }, 429, origin);

    const duplicate = website.find((row: any) => row?.data?.fingerprint === fingerprint && (now - Date.parse(row.created_at || row?.data?.created || 0)) < DUP_WINDOW_MS);
    if (duplicate) return json({ ok: true, duplicate: true, id: duplicate?.data?.id || null }, 200, origin);

    const id = `web_${now.toString(36)}_${crypto.randomUUID().slice(0, 8)}`;
    const context = answersSummary || Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join(' · ');
    const summary = `Website lead — ${name} · ${phone} · ${service}${address ? ` · ${address}` : ''}${context ? `. ${context.slice(0, 420)}` : ''}${description ? `. ${description.slice(0, 320)}` : ''}`;
    const data = {
      id,
      type: 'website_lead',
      status: 'open',
      title: `Website service request · ${name}`,
      msg: summary,
      source: 'website',
      requestSource: 'otto-plumbing-site',
      name,
      phone,
      phoneDigits: digits,
      email,
      service,
      serviceKey,
      category: serviceKey,
      location: address,
      address,
      contactPreference,
      answers,
      answersSummary: context,
      details: description,
      description,
      preferredDate,
      preferredWindow,
      language,
      page,
      intakeVersion: guided ? 'guided-v2' : 'legacy-v1',
      submittedAt: nowIso,
      created: nowIso,
      updated: nowIso,
      fingerprint,
      ipHash
    };
    await Promise.all([
      insertRecord('alerts', id, { ...data, source: 'otto-plumbing-site' }),
      insertRecord('calls', id, data)
    ]);
    return json({ ok: true, id, receivedAt: nowIso }, 200, origin);
  } catch (error) {
    console.error('website-intake failed', error instanceof Error ? error.message : String(error));
    return json({ error: 'delivery_failed' }, 503, origin);
  }
});
