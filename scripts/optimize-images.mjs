/**
 * Build-time image optimizer.
 *
 * Walks the emitted static assets (public/ copies + bundled hero images) and
 * re-compresses every raster image above `MIN_BYTES` in-place, keeping the
 * original filename/format so existing references keep working. Huge images
 * are also downscaled to at most `MAX_DIMENSION` px on the longest side.
 *
 * Runs AFTER `vite build`, against the build output (STATIC_DIR below), not
 * against `public/`. The output directory does not exist until the build has
 * written it, and writing the twins into `public/` instead would scatter
 * generated artifacts through a git-tracked tree on every build. The deploy
 * uploads whatever is in the output directory when the build command exits, so
 * a post-build pass is what actually ships them — which is why `build` and
 * `build:node` in package.json both chain this script after `vite build`.
 *
 * Also emits a `.webp` twin next to every JPEG/PNG so the site's <WebpImage>
 * renderer can serve WebP to browsers automatically — the original format never
 * loads on the site.
 *
 * Twins are always written (even when the WebP payload is not smaller): the
 * rendered <source> is fixed at the twin URL, so if the file were skipped the
 * browser would show a broken image instead of falling back to the original.
 *
 * Responsive variants (see RESPONSIVE_VARIANTS) are regenerated from the
 * full-size originals on every build so `srcset` candidates always exist and
 * stay in sync with the source art. They are deliberately sized to each
 * component's real rendered width (plus DPR headroom) — never upscaled.
 *
 * Run `bun run verify:images` against a served build afterwards: that is the
 * only check that proves no rendered URL 404s, since `vite dev` synthesizes
 * twins on demand and would pass even with a broken pipeline.
 */
import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const STATIC_DIR = process.argv[2] ?? ".vercel/output/static";
// Exported so scripts/prerender-originals.mjs can reuse the exact same numbers
// instead of duplicating them — a drifted copy would silently produce a
// different build than the one these thresholds describe.
export const MIN_BYTES = 80 * 1024;
export const MAX_DIMENSION = 1600;
export const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
// Kept low: case-study JPEGs are up to 6000px / 5MB, and each sharp pipeline
// holds multiple full-frame buffers — 8 concurrent pipelines OOMs (bus error)
// on typical CI containers. 3 still keeps the step to a few seconds.
const CONCURRENCY = 3;

/**
 * Responsive variants regenerated from the full-size original on every build.
 * Each entry: source relative to STATIC_DIR + the widths to emit.
 * Output naming: `<base>-<w>.<ext>` next to the source, e.g.
 * `ProductDesign-480.webp`, `tiffinly/1-800.jpg`.
 *
 * Widths were chosen from each component's real rendered CSS width:
 * - Service cards (~664px desktop, full-width mobile): 480/768 (+1200 full)
 * - Tiffinly wide bento (~566px): 480/800/1200
 * - HaoCabs hero bento portrait (~566px, 941px source): 480/720 (+941 full)
 * - Partner marquee (160px card, 128px mobile): 160/320 (2x DPR)
 * - EDIOS normal bento (~285px): 480/800 (+1920 full)
 * - Team portraits (260px max-w card, aspect 4/5): 260/520/780 (1x/2x/3x)
 * - Client logo marquee (44px-tall row, 49-198px wide, object-cover): 160/320/480
 *
 * WebP variants use quality 76 (same as twins); JPEG fallbacks use the same
 * mozjpeg settings as full-size originals; PNG logo variants use palette
 * (they are smaller than WebP for flat logos).
 *
 * Service cards emit JPEG alongside WebP because their originals are opaque
 * 1200x824 photography-style art (no alpha, no flat brand colour): palette PNG
 * at 768w is ~200KB — barely half the original — while mozjpeg is ~50KB. That
 * keeps the `<img src>` fallback off the 293-445KB originals for any browser
 * that skips the WebP `<source>`. The full-size PNG stays the variant source
 * and is never a rendered candidate.
 */
export const RESPONSIVE_VARIANTS = [
  { src: "ProductDesign.png", widths: [480, 768], formats: ["webp", "jpg"] },
  // Service art that replaced the generated BrandIdentity/VisualIdentity pieces.
  // Both sources are 16:9 photography, so the 480/768 ladder still covers the
  // ~664px desktop slot at 1x and 2x DPR exactly as the PNGs did. They live
  // under images/ rather than at the static root because they are supplied
  // artwork, not build output — the generated twins sit beside their source,
  // so these land at images/brand-identity-480.webp and friends.
  { src: "images/brand-identity.jpeg", widths: [480, 768], formats: ["webp", "jpg"] },
  { src: "images/uiux.jpeg", widths: [480, 768], formats: ["webp", "jpg"] },
  { src: "images/website-development.jpeg", widths: [480, 768], formats: ["webp", "jpg"] },
  // Nothing renders these two any more — WhatWeDo.tsx moved to the supplied
  // artwork above. Their entries stay ONLY so the committed -480/-768 twins keep
  // being recognised as managed variants: drop them and `isResponsiveVariant`
  // starts returning false for those files, which silently subjects them to
  // in-place recompression on every build. Delete the originals and their
  // variants together with these lines, never one without the other.
  { src: "BrandIdentity.png", widths: [480, 768], formats: ["webp", "jpg"] },
  { src: "VisualIdentity.png", widths: [480, 768], formats: ["webp", "jpg"] },
  { src: "ProductDevelopment.png", widths: [480, 768], formats: ["webp", "jpg"] },
  { src: "Social Chums.png", widths: [160, 320], formats: ["webp", "png"] },
  { src: "Edios.png", widths: [160, 320], formats: ["webp", "png"] },
  { src: "tiffinly/1.jpg", widths: [480, 800, 1200], formats: ["webp", "jpg"] },
  { src: "HaoCabs/cover.png", widths: [480, 720], formats: ["webp"] },
  // Case-study cover art: .cs-cover__art caps at 1500px with ~40px of padding
  // on either side, so 1420px is the desktop slot and the 1600px original is
  // only ever needed for a >2x screen.
  { src: "HaoCabs/1.jpg", widths: [480, 800, 1200], formats: ["webp", "jpg"] },
  { src: "EDIOS/1.jpg", widths: [480, 800], formats: ["webp", "jpg"] },
  // Team portraits render inside a max-w-[260px] aspect-4/5 card, so 260w
  // covers 1x DPR, 520w 2x and 780w 3x. The originals are 1023-1600px
  // portraits (up to 724KB) that no browser ever needed in full.
  { src: "rishabh.png", widths: [260, 520, 780], formats: ["webp", "png"] },
  { src: "aakash.jpeg", widths: [260, 520, 780], formats: ["webp", "jpg"] },
  { src: "aman.jpeg", widths: [260, 520, 780], formats: ["webp", "jpg"] },
  { src: "harshita.jpeg", widths: [260, 520, 780], formats: ["webp", "jpg"] },
  { src: "shrishti.jpeg", widths: [260, 520, 780], formats: ["webp", "jpg"] },
  // Client logos sit in a 44px-tall marquee row and are drawn twice (the
  // second copy is aria-hidden for the loop). Their aspect ratios span
  // 1:1 to 4.5:1, so widths reach 198px at 44px height; 160/320/480 covers
  // 1x/2x/3x. Flat logos compress better as palette PNG than WebP, so both
  // formats are emitted and the <picture> offers them to the matching browser.
  ...["1", "2", "3", "4", "5", "6", "7", "9", "10", "11", "12", "13"].map((n) => ({
    src: `Clients/${n}.png`,
    widths: [160, 320, 480],
    formats: ["webp", "png"],
  })),
];

/** Basenames (without extension) that are managed responsive outputs. */
function variantBasenames() {
  const names = new Set();
  for (const v of RESPONSIVE_VARIANTS) {
    const base = v.src.replace(/\.(jpe?g|png)$/i, "");
    for (const w of v.widths) {
      for (const f of v.formats) {
        const ext = f === "jpg" ? "jpg" : f;
        names.add(`${base}-${w}.${ext}`.toLowerCase());
      }
    }
  }
  return names;
}

const VARIANT_NAMES = variantBasenames();

/** True for files that are responsive-variant outputs (never recompress). */
function isResponsiveVariant(file) {
  const rel = path.relative(STATIC_DIR, file).toLowerCase();
  return VARIANT_NAMES.has(rel);
}

let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (IMAGE_EXT.test(entry.name)) yield full;
  }
}

function lower_ext(file) {
  return file.toLowerCase();
}

/**
 * True when `file` is a .webp with a same-named .jpg/.jpeg/.png beside it —
 * the signature of a committed twin that writeWebpTwin will regenerate.
 */
function hasRasterSibling(file) {
  const base = file.replace(/\.webp$/i, "");
  return [".jpg", ".jpeg", ".png"].some((ext) => existsSync(base + ext));
}

function encoderFor(file, dims) {
  const lower = file.toLowerCase();
  let base = sharp(file, { failOn: "none" }).resize({
    width: dims.width,
    height: dims.height,
    withoutEnlargement: true,
  });
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    base = base.jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:4:4" });
  } else if (lower.endsWith(".png")) {
    base = base.png({ quality: 82, compressionLevel: 9, palette: true, adaptiveFiltering: true });
  } else if (lower.endsWith(".webp")) {
    base = base.webp({ quality: 78, effort: 4 });
  } else if (lower.endsWith(".avif")) {
    base = base.avif({ quality: 55, effort: 4 });
  }
  return base;
}

/**
 * Emits a `<name>.webp` twin for a JPEG/PNG so WebpImage can serve WebP
 * automatically. The twin is always written — WebpImage's rendered `<source>`
 * points at it unconditionally, so skipping it would leave a broken image in
 * the browser rather than falling back to the original.
 *
 * Managed responsive variants are skipped here: their `.webp` counterpart is
 * generated directly from the full-size original by generateResponsiveVariants
 * (higher quality than re-encoding the already-compressed resized JPEG).
 */
async function writeWebpTwin(file, dims) {
  const lower = file.toLowerCase();
  if (!(lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png"))) return;
  if (isResponsiveVariant(file)) return;
  // A resized JPEG (e.g. tiffinly/1-480.jpg) is itself a responsive variant —
  // its .webp twin IS the managed webp variant, so don't overwrite it here.
  if (/-\d+\.(jpe?g|png)$/i.test(file)) {
    const twin = file.replace(/\.(jpe?g|png)$/i, ".webp");
    if (VARIANT_NAMES.has(path.relative(STATIC_DIR, twin).toLowerCase())) return;
  }

  const stat = await fs.stat(file);
  const out = await sharp(file, { failOn: "none" })
    .resize({
      width: dims.width,
      height: dims.height,
      withoutEnlargement: true,
    })
    .webp({ quality: 76, effort: 4 })
    .toBuffer();

  const twin = file.replace(/\.(jpe?g|png)$/i, ".webp");
  // Atomic write: a crash/OOM mid-write must never leave a truncated .webp
  // behind (the next build would then fail reading it as an input image).
  const tmpTwin = `${twin}.opt.tmp`;
  await fs.writeFile(tmpTwin, out);
  await fs.rename(tmpTwin, twin);
  const delta = stat.size - out.length;
  const sign = delta >= 0 ? "-" : "+";
  const pct = (Math.abs(delta) / stat.size) * 100;
  console.log(
    `  ${(stat.size / 1024).toFixed(0).padStart(6)}K -> ${(out.length / 1024).toFixed(0).padStart(6)}K  (${sign}${pct.toFixed(0).padStart(2)}%)  ${path.relative(STATIC_DIR, twin)} (webp)`,
  );
}

async function optimizeFile(file) {
  // Responsive variants ship pre-sized and pre-compressed (all < MIN_BYTES);
  // never recompress them in place — that would add a second lossy pass.
  if (isResponsiveVariant(file)) {
    skipped += 1;
    return;
  }

  const meta = await sharp(file).metadata();
  if (!meta.format || ["svg", "gif"].includes(meta.format)) {
    skipped += 1;
    return;
  }

  const dims = {};
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (longest > MAX_DIMENSION) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) dims.width = MAX_DIMENSION;
    else dims.height = MAX_DIMENSION;
  }

  await writeWebpTwin(file, dims);

  // A committed .webp next to a .jpg/.jpeg/.png of the same name is a build
  // artifact, and writeWebpTwin above regenerates it from that sibling into
  // this exact path. Recompressing it in place as well means two workers write
  // one file, so with CONCURRENCY > 1 the bytes depend on which worker lands
  // last — two builds from identical input produced different output. Stand
  // down: writeWebpTwin already emits the file this would have produced.
  if (lower_ext(file).endsWith(".webp") && hasRasterSibling(file)) {
    skipped += 1;
    return;
  }

  const stat = await fs.stat(file);
  if (stat.size < MIN_BYTES) {
    skipped += 1;
    return;
  }

  const out = await encoderFor(file, dims).toBuffer();
  if (out.length >= stat.size) {
    skipped += 1;
    return;
  }

  const tmp = `${file}.opt.tmp`;
  await fs.writeFile(tmp, out);
  await fs.rename(tmp, file);

  totalBefore += stat.size;
  totalAfter += out.length;
  processed += 1;
  const pct = ((stat.size - out.length) / stat.size) * 100;
  console.log(
    `  ${(stat.size / 1024).toFixed(0).padStart(6)}K -> ${(out.length / 1024).toFixed(0).padStart(6)}K  (-${pct.toFixed(0).padStart(2)}%)  ${path.relative(STATIC_DIR, file)}`,
  );
}

/**
 * Regenerates every RESPONSIVE_VARIANTS output from its full-size original.
 * Runs before the main walk so variants always exist (fresh builds copy
 * public/ first, so sources are present) and stay in sync with the art.
 * Existing variant files are overwritten deterministically — same input art
 * yields byte-comparable output, so no cache-busting churn beyond content.
 */
async function generateResponsiveVariants() {
  let made = 0;
  for (const v of RESPONSIVE_VARIANTS) {
    const srcFile = path.join(STATIC_DIR, v.src);
    let exists = true;
    try {
      await fs.access(srcFile);
    } catch {
      exists = false;
    }
    if (!exists) continue;
    const base = srcFile.replace(/\.(jpe?g|png)$/i, "");
    for (const width of v.widths) {
      for (const format of v.formats) {
        const dest = `${base}-${width}.${format === "jpg" ? "jpg" : format}`;
        try {
          let pipeline = sharp(srcFile, { failOn: "none" }).resize({
            width,
            withoutEnlargement: true,
          });
          if (format === "webp") pipeline = pipeline.webp({ quality: 76, effort: 4 });
          else if (format === "jpg")
            pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:4:4" });
          else if (format === "png")
            pipeline = pipeline.png({
              quality: 82,
              compressionLevel: 9,
              palette: true,
              adaptiveFiltering: true,
            });
          const out = await pipeline.toBuffer();
          const tmpDest = `${dest}.opt.tmp`;
          await fs.writeFile(tmpDest, out);
          await fs.rename(tmpDest, dest);
          made += 1;
        } catch (err) {
          console.error(`  ! variant failed ${path.relative(STATIC_DIR, dest)}: ${err.message}`);
        }
      }
    }
  }
  if (made > 0) console.log(`  generated ${made} responsive variants`);
}

async function main() {
  console.log(`Optimizing images in ${STATIC_DIR}…`);

  await generateResponsiveVariants();

  const files = [];
  for await (const file of walk(STATIC_DIR)) files.push(file);

  let cursor = 0;
  const worker = async () => {
    while (true) {
      const index = cursor++;
      if (index >= files.length) return;
      try {
        await optimizeFile(files[index]);
      } catch (err) {
        console.error(`  ! failed ${path.relative(STATIC_DIR, files[index])}: ${err.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

  const saved = totalBefore - totalAfter;
  console.log(
    `\nDone: ${processed} compressed, ${skipped} skipped ` +
      `(kept ${(totalAfter / 1024).toFixed(0)}K from ${(totalBefore / 1024).toFixed(0)}K, saved ${(saved / 1024).toFixed(0)}K)`,
  );
}

// Only run when invoked directly. Imported by prerender-originals.mjs for the
// shared thresholds and variant table, which must not trigger a build pass.
// argv[1] is undefined under `node -e`, where pathToFileURL would throw, so
// guard the direct-run check rather than assume a script path.
const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
