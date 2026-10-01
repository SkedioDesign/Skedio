/**
 * Rewrites committed originals above MAX_DIMENSION so the repo stops carrying
 * resolution the build throws away.
 *
 * `optimize-images.mjs` already downscales every image past 1600px on the
 * longest side and recompresses it, so those source pixels never reach a
 * visitor — they only sit in git history, costing clone time forever. This
 * script applies that exact transform to the sources up front, so the build
 * step becomes a no-op on them.
 *
 * Byte-identity is the whole contract here: the committed file must encode to
 * precisely what the build would have produced from the original. Three
 * details make that true, and each was established by measuring the real
 * script rather than by assumption:
 *
 *  1. Sources listed in RESPONSIVE_VARIANTS are skipped. Variants are
 *     regenerated from the full-size original *before* the main walk, so
 *     shrinking a source silently changes every `-480`/`-800` candidate.
 *  2. The intermediate is written LOSSLESS (PNG payload under any extension).
 *     A lossy intermediate would be re-encoded by the build, compounding two
 *     JPEG generations and changing the output.
 *  3. When the lossless intermediate falls below MIN_BYTES the file is left
 *     alone entirely. Committing an already-recompressed source would feed a
 *     second lossy generation into the .webp twin that writeWebpTwin derives
 *     from it, changing bytes the build did not otherwise change.
 *
 * This does not delete or move anything: it rewrites files in place, and
 * `git checkout -- public/` restores the originals.
 *
 * Usage: node scripts/prerender-originals.mjs [dir] [--write]
 *        Without --write it only reports what it would change.
 */
import { existsSync as fsSync, promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_EXT, MAX_DIMENSION, MIN_BYTES, RESPONSIVE_VARIANTS } from "./optimize-images.mjs";

const ROOT = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "public";
const WRITE = process.argv.includes("--write");
const CONCURRENCY = 3;

/** Sources whose regenerated variants must keep seeing the full-size art. */
const VARIANT_SOURCES = new Set(RESPONSIVE_VARIANTS.map((v) => v.src));

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

async function main() {
  const files = [];
  for await (const file of walk(ROOT)) files.push(file);

  let cursor = 0;
  let saved = 0;
  let touched = 0;
  let skippedVariant = 0;
  let skippedTwin = 0;
  let skippedSmall = 0;
  let skippedGrowth = 0;
  let skippedTooSmall = 0;

  const worker = async () => {
    while (true) {
      const file = files[cursor++];
      if (!file) return;
      const rel = path.relative(ROOT, file).split(path.sep).join("/");
      try {
        const before = (await fs.stat(file)).size;
        // The build skips anything under MIN_BYTES, so rewriting it would
        // change a file the build never touches.
        if (before < MIN_BYTES) {
          skippedSmall += 1;
          continue;
        }

        const meta = await sharp(file).metadata();
        if (!meta.format || ["svg", "gif"].includes(meta.format)) continue;

        const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
        if (longest <= MAX_DIMENSION) continue;

        if (VARIANT_SOURCES.has(rel)) {
          skippedVariant += 1;
          continue;
        }

        // A committed .webp beside a same-named .jpg/.jpeg/.png is a build
        // artifact: writeWebpTwin regenerates it from that sibling on every
        // run. Rewriting it here would feed a second lossy generation into the
        // twin and race the build's own write.
        if (
          rel.toLowerCase().endsWith(".webp") &&
          [".jpg", ".jpeg", ".png"].some((ext) => fsSync.existsSync(file.replace(/\.webp$/i, ext)))
        ) {
          skippedTwin += 1;
          continue;
        }

        const dims =
          (meta.width ?? 0) >= (meta.height ?? 0)
            ? { width: MAX_DIMENSION }
            : { height: MAX_DIMENSION };

        const lossless = await sharp(file, { failOn: "none" })
          .resize({ width: dims.width, height: dims.height, withoutEnlargement: true })
          .png({ compressionLevel: 9, palette: false, adaptiveFiltering: false })
          .toBuffer();

        // Only the lossless intermediate is safe to commit. When it lands under
        // MIN_BYTES the build would skip recompression and ship our bytes
        // verbatim — but writeWebpTwin still derives the .webp twin from this
        // file, so committing an already-recompressed source feeds a second
        // lossy generation into the twin and changes its bytes. Leaving such
        // files untouched keeps the output identical; they are also the
        // smallest, so little is lost.
        if (lossless.length < MIN_BYTES) {
          skippedTooSmall += 1;
          continue;
        }

        const payload = lossless;

        // Never commit a growth: that would mean the resize no longer shrinks
        // this file, which is exactly the drift this script prevents.
        if (payload.length >= before) {
          skippedGrowth += 1;
          console.error(`  ! would grow, skipping: ${rel}`);
          continue;
        }

        if (WRITE) {
          const tmp = `${file}.prerender.tmp`;
          await fs.writeFile(tmp, payload);
          await fs.rename(tmp, file);
        }
        touched += 1;
        saved += before - payload.length;
        const pct = ((before - payload.length) / before) * 100;
        const verb = WRITE ? "rewrote" : "would rewrite";
        console.log(
          `  ${(before / 1024).toFixed(0).padStart(6)}K -> ${(payload.length / 1024)
            .toFixed(0)
            .padStart(6)}K  (-${pct.toFixed(0).padStart(2)}%)  ${verb}  ${rel}`,
        );
      } catch (err) {
        console.error(`  ! failed ${rel}: ${err.message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

  console.log(
    `\n${WRITE ? "Rewrote" : "Would rewrite"} ${touched} file(s) in ${ROOT}, ` +
      `saving ${(saved / 1024 / 1024).toFixed(1)} MB` +
      `  [${skippedVariant} variant sources, ${skippedTwin} committed twins, ` +
      `${skippedGrowth} would-grow, ${skippedTooSmall} lossless-too-small left alone]`,
  );
  if (!WRITE && touched > 0) console.log("Re-run with --write to apply.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
