# Interaction shell

This note covers the navigation and interaction layer only. It does not touch
copy, business facts, pricing, contact details, the customer intake work, or
deployment settings.

## What it is

Two new files:

- `shell.css` — styling for the interaction chrome
- `shell.js` — behaviour, added as one deferred script

`index.html` gains exactly two lines: one stylesheet link in the head and one
script tag before the closing body tag. Nothing else in the page markup was
rewritten, so a parallel visual redesign of the hero, services, business and
footer sections can land with almost no chance of a merge conflict.

Everything the shell adds is built by script at run time. If the script does
not load, the page is exactly the page that exists on `main`: every section is
visible, every link still works, and the phone numbers are untouched.

## What it adds

### Mobile navigation

Below 980px the site previously hid its nav links with no replacement, so the
only way to reach a section on a phone was to scroll. There is now a labelled
**Menu** button in the header that opens a side panel containing:

- Top of page, Services, Commercial, Contact
- a call action and a text action, mirroring the header actions

Panel behaviour: focus moves to the close control on open, Tab is kept inside
the panel, Escape closes it, tapping the dimmed background closes it, focus
returns to the Menu button, and the page behind it cannot scroll while it is
open. The panel is capped to the viewport and scrolls internally, so it can
never grow taller than the screen. Closing the panel restores the exact scroll
position the reader had.

### Back navigation

Any in-page jump longer than 200px arms a **Back to where you were** bar at the
bottom of the screen, with a Dismiss control beside it. It is a full text
label, not an icon. Using it returns the reader to the precise offset they
jumped from and puts focus back on the control they used. The bar retires by
itself once the reader has travelled away and come back near the origin, and
Escape clears it.

A **Back to top** control appears only after the reader has passed roughly one
and a fifth screens, and the footer carries a permanent, non-floating
"Back to top of page" link so the end of the page is never a dead end.

Nothing floats over the page at rest. At the top of the document both dock
controls are inactive and non-interactive.

### Minimize and maximize

The two long grid sections, Services and Commercial, each carry one labelled
control that switches between **Minimize** and **Expand**. Minimizing collapses
the grid with a restrained height transition and leaves the heading, the lead
paragraph and a short line reading "Minimized. 6 items hidden." in place, so the
collapsed state never hides what the section is. The choice is remembered in
`localStorage` under `otto-site-sections`.

These controls were added to those two sections only. The hero, the contact
block and the closing call to action are short and always useful, so they were
left alone rather than decorated with controls that earn nothing.

### Section jumps and current state

Every internal link now scrolls to a position that clears the sticky header
instead of hiding the heading underneath it, and moves focus to the section
heading so keyboard and screen reader users travel with the page. The desktop
nav marks the section currently in view.

## Identifiers

Controls use the `shell-` prefix throughout (`.shell-menu-btn`, `.shell-drawer`,
`.shell-panel`, `.shell-section-toggle`, `.shell-collapse`, `.shell-return`,
`.shell-top`) and the root classes `shell-lock`, `shell-scrolled`, `shell-ready`.
No existing class, id, data attribute or script hook was renamed.

Translated strings use `data-shell-copy`, deliberately not `data-i18n`. The
page's own `setLang()` overwrites the text of every `[data-i18n]` element, so
reusing that attribute on a control with child elements would destroy it. The
shell listens for the language buttons and re-renders its own copy in English
and Spanish.

Motion respects `prefers-reduced-motion`: transitions and smooth scrolling are
dropped and every control still works.

## How it was tested

A local Chromium run drives the real page at 390, 430, 768 and 1440 and
performs genuine input: pointer clicks at the control's own coordinates, wheel
gestures, Tab, Enter and Escape. 134 assertions cover overflow, control
placement, tap sizes, menu open and close, focus movement and return, the focus
loop, scroll locking, panel fit and internal scrolling, jump offsets, the Back
bar, back to top, collapse and expand including persistence across a reload, and
both languages. All 134 pass.

The test script itself is not committed; it lives outside the deployed site.

## Known limits

- Widths are emulated Chromium viewports, not physical devices.
- The sandbox has no network access, so the Vercel preview for this branch could
  not be opened. Verification was done against the real file as it will ship.
- Section collapse state is stored per browser. A reader on a second device
  starts with everything expanded, which is the intended default.
