/**
 * Responsive <img> candidate sets for the portfolio cover images.
 *
 * Widths track each image's real CSS width so the browser never downloads the
 * full-size original on mobile. Entries are keyed by the cover path used in
 * `src/data/projects.ts`; an image with no entry falls back to a single src.
 *
 * These variants are regenerated on every build by scripts/optimize-images.mjs,
 * so the URLs below always exist — never add an entry without a matching
 * RESPONSIVE_VARIANTS record, or the browser would 404 with no cross-candidate
 * fallback.
 */

export interface ResponsiveCandidates {
  src: string;
  srcSet?: string;
  webpSrcSet: string;
}

/** Bento/card cells that span the full grid width. */
export const WIDE_SIZES = "(max-width: 768px) 100vw, 566px";
/** Cells that share a grid row two-up. */
export const COMPACT_SIZES = "(max-width: 768px) 50vw, 285px";
/** Full-bleed editorial rows on the /projects hub. */
export const HERO_SIZES = "(max-width: 768px) 100vw, 780px";
/**
 * Team portraits render inside a `max-w-[260px]` aspect-4/5 card on /about, so
 * the slot width never exceeds 260px at any breakpoint — the grid collapses to
 * one column on mobile but the inner cap still holds it to 260px.
 */
export const TEAM_PHOTO_SIZES = "260px";
/** Intrinsic box of that portrait card, kept for width/height attributes. */
export const TEAM_PHOTO_WIDTH = 260;
export const TEAM_PHOTO_HEIGHT = 325;

/**
 * - HaoCabs cover (hero cell, portrait 941px source, object-cover): 480w for
 *   mobile, 720w for desktop 1x, full 941w twin for 2x DPR. The source aspect
 *   differs from the container — the crop stays object-cover; only the
 *   delivered resolution changes.
 * - Tiffinly (wide cell, 1600px source, object-cover): 480w mobile, 800w
 *   desktop 1x, 1200w for 2x DPR. Both WebP and JPEG fallback candidates are
 *   provided.
 * - EDIOS (normal cell, 1920px source): 480w covers desktop 1x; the full twin
 *   remains for larger DPR.
 *
 * `sizes` is deliberately NOT stored here: the same image is rendered at very
 * different slot widths (bento cell vs. full-width /projects row), so the
 * caller supplies the sizes hint that matches its own layout.
 */
const responsiveByImage: Record<string, ResponsiveCandidates> = {
  "/HaoCabs/cover.png": {
    src: "/HaoCabs/cover.png",
    webpSrcSet:
      "/HaoCabs/cover-480.webp 480w, /HaoCabs/cover-720.webp 720w, /HaoCabs/cover.webp 941w",
  },
  "/tiffinly/1.jpg": {
    src: "/tiffinly/1-800.jpg",
    srcSet: "/tiffinly/1-480.jpg 480w, /tiffinly/1-800.jpg 800w, /tiffinly/1-1200.jpg 1200w",
    webpSrcSet: "/tiffinly/1-480.webp 480w, /tiffinly/1-800.webp 800w, /tiffinly/1-1200.webp 1200w",
  },
  "/EDIOS/1.jpg": {
    src: "/EDIOS/1-800.jpg",
    srcSet: "/EDIOS/1-480.jpg 480w, /EDIOS/1-800.jpg 800w, /EDIOS/1.webp 1920w",
    webpSrcSet: "/EDIOS/1-480.webp 480w, /EDIOS/1-800.webp 800w, /EDIOS/1.webp 1920w",
  },
  // Team portraits: 1023-1600px originals (up to 724KB) for a 260px card.
  // src points at the 2x candidate so browsers without srcset still avoid the
  // multi-hundred-KB original.
  "/rishabh.png": {
    src: "/rishabh-520.png",
    srcSet: "/rishabh-260.png 260w, /rishabh-520.png 520w, /rishabh-780.png 780w",
    webpSrcSet: "/rishabh-260.webp 260w, /rishabh-520.webp 520w, /rishabh-780.webp 780w",
  },
  "/aakash.jpeg": {
    src: "/aakash-520.jpg",
    srcSet: "/aakash-260.jpg 260w, /aakash-520.jpg 520w, /aakash-780.jpg 780w",
    webpSrcSet: "/aakash-260.webp 260w, /aakash-520.webp 520w, /aakash-780.webp 780w",
  },
  "/aman.jpeg": {
    src: "/aman-520.jpg",
    srcSet: "/aman-260.jpg 260w, /aman-520.jpg 520w, /aman-780.jpg 780w",
    webpSrcSet: "/aman-260.webp 260w, /aman-520.webp 520w, /aman-780.webp 780w",
  },
  "/harshita.jpeg": {
    src: "/harshita-520.jpg",
    srcSet: "/harshita-260.jpg 260w, /harshita-520.jpg 520w, /harshita-780.jpg 780w",
    webpSrcSet: "/harshita-260.webp 260w, /harshita-520.webp 520w, /harshita-780.webp 780w",
  },
  "/shrishti.jpeg": {
    src: "/shrishti-520.jpg",
    srcSet: "/shrishti-260.jpg 260w, /shrishti-520.jpg 520w, /shrishti-780.jpg 780w",
    webpSrcSet: "/shrishti-260.webp 260w, /shrishti-520.webp 520w, /shrishti-780.webp 780w",
  },
};

// Client logos all share one width ladder (160/320/480 for a 44px-tall row).
// They are generated from the same list as the RESPONSIVE_VARIANTS entries in
// scripts/optimize-images.mjs — keep the two in sync.
const CLIENT_LOGO_IDS = ["1", "2", "3", "4", "5", "6", "7", "9", "10", "11", "12", "13"];
for (const id of CLIENT_LOGO_IDS) {
  const base = `/Clients/${id}`;
  responsiveByImage[`${base}.png`] = {
    src: `${base}-320.png`,
    srcSet: `${base}-160.png 160w, ${base}-320.png 320w, ${base}-480.png 480w`,
    webpSrcSet: `${base}-160.webp 160w, ${base}-320.webp 320w, ${base}-480.webp 480w`,
  };
}

export function responsiveFor(image: string): ResponsiveCandidates {
  return (
    responsiveByImage[image] ?? {
      src: image,
      webpSrcSet: "",
    }
  );
}
