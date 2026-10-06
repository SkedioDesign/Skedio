/**
 * Pads the Design System 101 hero illustration into a SQUARE canvas so that
 * every card on the site can show all of it.
 *
 * Why a square: every surface that renders this artwork does so with
 * `object-cover` and a different box shape —
 *
 *   featured card  aspect-[3/2]   (blog index + homepage)
 *   list thumbnail aspect-square  (the 96px thumbs beside each list entry)
 *   social card     1.91:1        (Facebook/LinkedIn center-crop og:image)
 *
 * A wide 16:9 source cannot fill any of those without losing its sides: the
 * 3:2 card clipped ~39px of content on the left and ~80px on the right, and
 * the square thumbnail threw away more than a third of the width. A square
 * source is the one shape all three windows can show whole, because cover on a
 * square only ever crops the *height* — and the artwork is short enough to sit
 * inside every one of those windows with margin to spare (checked below, so a
 * future export that is too tall fails here rather than shipping cropped).
 *
 * The padding is filled by replicating the artwork's own edge rows, not by a
 * flat colour: the background carries a faint gradient, and a mismatched fill
 * would leave a visible seam where the pad meets the original file.
 *
 * Run: node scripts/pad-design-system-hero.mjs
 * Output is committed to public/ (it is a served file), so re-run this only
 * when the source art in src/assets changes.
 */
import { promises as fs } from "node:fs";
import sharp from "sharp";

const SRC = "src/assets/design-system-101-hero.png";
const OUT = "public/DesignSystem-101-Hero-Illustration.png";
/**
 * Must stay <= MAX_DIMENSION in scripts/optimize-images.mjs (1600): anything
 * larger gets downscaled in the build output, which would make the declared
 * og:image:width/height and the blog cards' intrinsic width/height hints
 * describe a file that no longer exists.
 */
const TARGET = 1600;
/** Pixels that differ from the background by less than this sum are background. */
const BG_TOLERANCE = 30;
/** The card hovers zoom the image (scale 1.02 / 1.04), cropping ~1-2% more. */
const HOVER_MARGIN = 0.02;
/** Every window the artwork has to fit inside, unclipped. */
const WINDOWS = [
  ["featured card 3:2", 3 / 2],
  ["list thumbnail 1:1", 1 / 1],
  ["social card 1.91:1", 1.91],
];

function contentBBox(data, width, height, channels) {
  const px = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const bg = px(2, 2);
  const isBg = ([r, g, b]) =>
    Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) < BG_TOLERANCE;

  let left = width - 1;
  let right = 0;
  let top = height - 1;
  let bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isBg(px(x, y))) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < left || bottom < top) throw new Error("no content found — is the source blank?");
  return { left, right, top, bottom, width: right - left + 1, height: bottom - top + 1 };
}

/** Top-left of the centered crop window `aspect` takes out of a TARGET box. */
function windowBox(aspect) {
  const w = aspect >= 1 ? TARGET : Math.round(TARGET * aspect);
  const h = aspect >= 1 ? Math.round(TARGET / aspect) : TARGET;
  return { x: (TARGET - w) / 2, y: (TARGET - h) / 2, w, h };
}

async function main() {
  const resized = await sharp(SRC)
    .resize({ width: TARGET, withoutEnlargement: true })
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });
  const { data, info } = resized;
  const { width, height, channels } = info;
  if (width !== TARGET) throw new Error(`source is ${width}px wide; expected ${TARGET}px`);

  const box = contentBBox(data, width, height, channels);
  // Centre the CONTENT, not the file: the original has 176px of headroom above
  // the artwork and only 10px below, so centring the file would leave the
  // drawing sitting low in every window.
  const top = Math.round((TARGET - box.height) / 2) - box.top;
  const bottom = TARGET - height - top;
  if (top < 0 || bottom < 0) {
    throw new Error(
      `content is ${box.height}px tall — too tall for a ${TARGET}px square. ` +
        `Reduce the artwork's own height or raise TARGET and MAX_DIMENSION together.`,
    );
  }

  // Replicate the artwork's first/last row across the padding so the join is
  // pixel-continuous — a flat fill would show a line against the gradient.
  const rowBytes = width * channels;
  const padRow = (startRow, count) => {
    const row = Buffer.from(data.subarray(startRow * rowBytes, (startRow + 1) * rowBytes));
    return Buffer.alloc(rowBytes * count, row);
  };

  const padded = Buffer.concat([padRow(0, top), data, padRow(height - 1, bottom)]);

  const moved = {
    left: box.left,
    right: box.right,
    top: box.top + top,
    bottom: box.bottom + top,
  };

  // Refuse to ship anything a card will clip: each window, plus the hover zoom
  // that eats a further ~2% of the visible edge, must clear the content.
  const failures = [];
  for (const [label, aspect] of WINDOWS) {
    const win = windowBox(aspect);
    const inset = Math.min(win.w, win.h) * HOVER_MARGIN;
    const visible = {
      x: win.x + inset,
      y: win.y + inset,
      w: win.w - inset * 2,
      h: win.h - inset * 2,
    };
    const fits =
      moved.left >= visible.x &&
      moved.right <= visible.x + visible.w &&
      moved.top >= visible.y &&
      moved.bottom <= visible.y + visible.h;
    console.log(
      `  ${fits ? "ok  " : "FAIL"} ${label.padEnd(20)} window ${Math.round(visible.x)},${Math.round(
        visible.y,
      )} ${Math.round(visible.w)}x${Math.round(visible.h)} vs content ${moved.left},${moved.top} ${box.width}x${box.height}`,
    );
    if (!fits) failures.push(label);
  }
  if (failures.length) throw new Error(`content would be clipped by: ${failures.join(", ")}`);

  await sharp(padded, { raw: { width: TARGET, height: TARGET, channels } })
    // Same encoder settings as optimizeFile in scripts/optimize-images.mjs, so
    // the committed file matches what the build would have produced and the
    // optimizer's later pass is a no-op rather than a second quantisation.
    .png({ quality: 82, compressionLevel: 9, palette: true, adaptiveFiltering: true })
    .toFile(OUT);
  const stat = await fs.stat(OUT);
  console.log(
    `wrote ${OUT} — ${TARGET}x${TARGET}, pad ${top}px top / ${bottom}px bottom, ${(stat.size / 1024).toFixed(0)}K`,
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
