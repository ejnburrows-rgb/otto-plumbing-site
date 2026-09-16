const BUCKET = 'job-photos';

function adminHeaders() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  let modern = '';
  try { modern = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default || ''; } catch (_) {}
  const key = modern || legacy;
  if (!key) throw new Error('missing_admin_key');
  const headers: Record<string,string> = { apikey:key, 'Content-Type':'application/json', Accept:'application/json' };
  if (legacy) headers.Authorization = `Bearer ${legacy}`;
  return headers;
}

Deno.serve(async (req:Request) => {
  if (req.method !== 'GET') return new Response('Method not allowed', { status:405 });
  const urlObj = new URL(req.url);
  const id = String(urlObj.searchParams.get('id') || '').trim();
  const token = String(urlObj.searchParams.get('token') || '').trim();
  if (!/^web_[A-Za-z0-9_-]{6,120}$/.test(id) || !/^[a-f0-9]{64}$/i.test(token)) {
    return new Response('Not found', { status:404, headers:{'Cache-Control':'no-store'} });
  }
  try {
    const base = Deno.env.get('SUPABASE_URL') || '';
    if (!base) throw new Error('missing_supabase_url');
    const lookup = await fetch(`${base}/rest/v1/alerts?id=eq.${encodeURIComponent(id)}&select=data&limit=1`, { headers:adminHeaders() });
    if (!lookup.ok) throw new Error(`lookup_${lookup.status}`);
    const rows = await lookup.json();
    const record = rows[0] && rows[0].data;
    const fromWebsite = record && (record.requestSource === 'otto-plumbing-site' || record.source === 'otto-plumbing-site');
    const path = String(record && (record.attachmentPath || record.claimPdfPath) || '').trim();
    const expected = String(record && record.downloadToken || '').trim();
    if (!record || !fromWebsite || !path.startsWith('website-requests/') || !expected || token !== expected) {
      return new Response('Not found', { status:404, headers:{'Cache-Control':'no-store'} });
    }
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    const sign = await fetch(`${base}/storage/v1/object/sign/${BUCKET}/${encoded}`, {
      method:'POST', headers:adminHeaders(), body:JSON.stringify({ expiresIn:120 })
    });
    if (!sign.ok) return new Response('File unavailable', { status: sign.status === 404 ? 404 : 502, headers:{'Cache-Control':'no-store'} });
    const body = await sign.json();
    const signed = body.signedURL || body.signedUrl || (body.data && body.data.signedURL);
    if (!signed) return new Response('File unavailable', { status:502, headers:{'Cache-Control':'no-store'} });
    const absolute = /^https?:\/\//i.test(signed) ? signed : `${base}/storage/v1${signed.startsWith('/') ? signed : '/' + signed}`;
    return Response.redirect(absolute, 302);
  } catch (_) {
    return new Response('File unavailable', { status:502, headers:{'Cache-Control':'no-store'} });
  }
});
