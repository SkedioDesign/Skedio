# SEO Verification (Google Search Console & Bing Webmaster Tools)

Domain to verify: **https://skedio.studio**

This site supports both common verification methods. Do **not** deploy placeholder
codes — generate real ones from each platform's dashboard first.

## Method 1 — Meta tag (already wired as placeholders)

Placeholder `<meta>` tags already exist in `src/routes/__root.tsx` under the
"SEARCH CONSOLE VERIFICATION" comment block:

```tsx
{ name: "google-site-verification", content: "REPLACE_WITH_CODE" },
{ name: "msvalidate.01", content: "REPLACE_WITH_CODE" },
```

Steps:

1. **Google** — go to <https://search.google.com/search-console> → *Add property* →
   choose the **HTML tag** option → copy the code given (a long `google-site-verification` value).
2. **Bing** — go to <https://www.bing.com/webmasters> → add site →
   choose the **Meta tag** option → copy the `msvalidate.01` content value.
3. Paste each real code into `__root.tsx`, replacing `REPLACE_WITH_CODE`.
4. Redeploy, then click *Verify* in each dashboard.

The tags render in the `<head>` of every page via the root route, so either engine
will see them on any URL.

## Method 2 — HTML/XML file (drop into `public/`)

If a platform issues a file instead of a meta tag, drop it straight into
`public/` — static files there are served as-is at the site root:

- **Google HTML file** — e.g. `public/google1234567890abcdef.html`
  (must be reachable at `https://skedio.studio/google1234567890abcdef.html`)
- **Bing XML file** — e.g. `public/BingSiteAuth.xml`
  (must be reachable at `https://skedio.studio/BingSiteAuth.xml`)

Your local dev server and the production build both serve `public/` at the
site root, so no routing or config changes are needed. After adding the file,
confirm the URL loads in a browser, then click *Verify*.

## Checklist

- [ ] Generate real `google-site-verification` code and paste into `src/routes/__root.tsx`
- [ ] Generate real `msvalidate.01` code and paste into `src/routes/__root.tsx`
- [ ] (Alternative) Place any platform-issued verification HTML/XML file in `public/`
- [ ] Redeploy `https://skedio.studio`, confirm the meta tag or file is live, then verify