/**
 * Catches the failure mode the WebP pipeline is built to make impossible: an
 * <img>/<source> pointing at a file the deployment never emitted.
 *
 * <picture> is not forgiving. The moment a browser selects a `<source>` — and it
 * selects the WebP one unconditionally, because `<source type="image/webp">`
 * matches every browser that ships WebP — the `<img src>` fallback is never
 * consulted. A missing `.webp` twin is therefore a broken image, not a graceful
 * degradation, and it is invisible in dev because the dev middleware synthesizes
 * twins on demand (see devWebpMiddleware in vite.config.ts). Dev passing proves
 * nothing; only the built output does.
 *
 * So this checks the real thing: fetch a rendered page over HTTP from a running
 * build and GET every image URL the server actually emitted. A srcset whose
 * selected candidate 404s, a stale hashed asset name, or a srcset URL with no
 * matching RESPONSIVE_VARIANTS record all surface here as a non-200.
 *
 * Usage: node scripts/verify-images.mjs [baseUrl] [path]
 *        Defaults to http://localhost:3000/ — the port `bun run start` serves.
 *        Run it against `bun run preview` (a node-server build, which is what
 *        the local production preview uses) or against staging/production.
 */
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const PATHNAME = process.argv[3] ?? "/";

// React SSR emits `srcSet`/`srcset` (HTML attribute names are case-insensitive,
// so the browser still reads it) and preload links use `href`, hence the
// case-insensitive attribute matching here. Splitting srcset on "," is safe
// because none of these URLs contain a comma.
const IMAGE_URL = /\.(webp|avif|jpe?g|png|gif|svg)(\?|$)/i;

function collectUrls(html) {
  const urls = new Set();
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/gi)) {
    for (const candidate of m[1].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url && IMAGE_URL.test(url)) urls.add(url);
    }
  }
  for (const m of html.matchAll(/\bsrc="([^"]+)"/gi)) {
    if (IMAGE_URL.test(m[1])) urls.add(m[1]);
  }
  // <link rel="preload" as="image"> fetches before the <picture> is even parsed,
  // so a 404 here is both a broken image and a wasted connection.
  for (const m of html.matchAll(/<link\b[^>]*\bas="image"[^>]*>/gi)) {
    const href = /\bhref="([^"]+)"/.exec(m[0]);
    if (href && IMAGE_URL.test(href[1])) urls.add(href[1]);
  }
  return urls;
}

async function main() {
  const pageUrl = BASE + PATHNAME;
  let html;
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) throw new Error(`page responded ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error(`Could not fetch ${pageUrl}: ${err.message}`);
    console.error("Start a built server first: bun run preview");
    process.exit(1);
  }

  const urls = [...collectUrls(html)].sort();
  if (urls.length === 0) {
    console.error(`No image URLs found in ${pageUrl} — did the fetch get an error page?`);
    process.exit(1);
  }

  const failed = [];
  const checked = [];
  for (const url of urls) {
    const res = await fetch(new URL(url, BASE));
    const bytes = Number(res.headers.get("content-length") ?? 0);
    const row = { url, status: res.status, type: res.headers.get("content-type"), bytes };
    checked.push(row);
    if (res.status !== 200) failed.push(row);
  }

  for (const { url, status, type, bytes } of checked) {
    const mark = status === 200 ? "ok  " : "FAIL";
    console.log(
      `${mark} ${status} ${String(bytes).padStart(9)}B ${(type ?? "").padEnd(11)} ${url}`,
    );
  }

  console.log(
    `\n${checked.length} image URLs on ${pageUrl}: ` +
      `${checked.length - failed.length} ok, ${failed.length} broken`,
  );
  if (failed.length > 0) {
    console.error(
      "\nA 404 here means a <source>/<img> URL with no file behind it. Browsers do " +
        "not fall back once a <source> is selected, so this is a broken image.\n" +
        "Fix by adding the file to RESPONSIVE_VARIANTS in scripts/optimize-images.mjs " +
        "(it is then generated into the build output), or by correcting the URL.",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
