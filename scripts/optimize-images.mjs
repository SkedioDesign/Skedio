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
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const STATIC_DIR = process.argv[2] ?? ".vercel/output/static";
const MIN_BYTES = 80 * 1024;
const MAX_DIMENSION = 1600;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const CONCURRENCY = 8;

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
 */
async function writeWebpTwin(file, dims) {
  const lower = file.toLowerCase();
  if (!(lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png"))) return;

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
  await fs.writeFile(twin, out);
  const delta = stat.size - out.length;
  const sign = delta >= 0 ? "-" : "+";
  const pct = (Math.abs(delta) / stat.size) * 100;
  console.log(
    `  ${(stat.size / 1024).toFixed(0).padStart(6)}K -> ${(out.length / 1024).toFixed(0).padStart(6)}K  (${sign}${pct.toFixed(0).padStart(2)}%)  ${path.relative(STATIC_DIR, twin)} (webp)`,
  );
}

async function optimizeFile(file) {
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

async function main() {
  console.log(`Optimizing images in ${STATIC_DIR}…`);

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
