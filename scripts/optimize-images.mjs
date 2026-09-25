/**
 * Build-time image optimizer.
 *
 * Walks the emitted static assets (public/ copies + bundled hero images) and
 * re-compresses every raster image above `MIN_BYTES` in-place, keeping the
 * original filename/format so existing references keep working. Huge images
 * are also downscaled to at most `MAX_DIMENSION` px on the longest side.
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
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const STATIC_DIR = process.argv[2] ?? ".vercel/output/static";
const MIN_BYTES = 80 * 1024;
const MAX_DIMENSION = 1600;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
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
 *
 * WebP variants use quality 76 (same as twins); JPEG fallbacks use the same
 * mozjpeg settings as full-size originals; PNG logo variants use palette
 * (they are smaller than WebP for flat logos).
 */
const RESPONSIVE_VARIANTS = [
  { src: "ProductDesign.png", widths: [480, 768], formats: ["webp"] },
  { src: "BrandIdentity.png", widths: [480, 768], formats: ["webp"] },
  { src: "VisualIdentity.png", widths: [480, 768], formats: ["webp"] },
  { src: "ProductDevelopment.png", widths: [480, 768], formats: ["webp"] },
  { src: "Social Chums.png", widths: [160, 320], formats: ["webp", "png"] },
  { src: "Edios.png", widths: [160, 320], formats: ["webp", "png"] },
  { src: "tiffinly/1.jpg", widths: [480, 800, 1200], formats: ["webp", "jpg"] },
  { src: "HaoCabs/cover.png", widths: [480, 720], formats: ["webp"] },
  { src: "EDIOS/1.jpg", widths: [480, 800], formats: ["webp", "jpg"] },
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
