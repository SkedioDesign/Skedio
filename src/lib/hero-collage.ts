/*
 * Data + timing for the hero's post-video sequence.
 *
 * After the hero video finishes: client logos appear, shrink into a strip
 * pinned to the bottom, the project imagery assembles as a flush collage, and
 * then each screen is shown full-frame as a slow slideshow.
 *
 * WHY A SEPARATE MODULE: the image list and the pacing constants are pure data
 * shared by the route's markup and its GSAP timelines, so keeping them here
 * makes both auditable — and tunable — in one place.
 */

/**
 * One entry per collage card / slideshow slide, in order.
 *
 * The source folders hold 58 files, but that is not 58 images: each shot is
 * stored as a .jpg AND a .webp, and several also carry responsive siblings
 * (-480 / -800 / -1200) of that same shot. Listing files verbatim would show
 * "tiffinly/1" four times over. Deduplicating to base shot id gives 30
 * genuinely distinct shots across the three published projects; this is a
 * 14-shot subset of those.
 *
 * 14 is deliberate, not arbitrary: the collage is a 4-column grid whose cells
 * are 16:9 to match these landscape shots, and the final row's two cards each
 * span two columns. 4 + 4 + 4 + 2x2 = a flush rectangle with no holes. A count
 * that is not a multiple of 4 (or 4n-2) cannot fill that grid, which is why
 * this is 14 and not 15.
 *
 * To widen the collage, change the grid in the route AND the count here
 * together — the two are coupled. Prefer the smaller webp and responsive
 * siblings; the full 30-shot set shipped 1.76MB after the build's optimize
 * pass, and every card added is paid for on mobile data.
 */
export const heroCollageImages: string[] = [
  // The -800/-720 rungs, not the -480 ones. A cell is 333px wide, so at 2x DPR
  // it wants 666px of source; the 480px variants delivered 1.44 and read as a
  // visibly soft card among 4.8 neighbours — most obviously the first one, which
  // is the only card with nothing over it. Costs +2KB and +15KB respectively.
  "/EDIOS/1-800.webp",
  "/EDIOS/2.jpg",
  "/EDIOS/5.jpg",
  "/EDIOS/11.jpg",
  "/EDIOS/12.jpg",
  "/HaoCabs/1.webp",
  "/HaoCabs/2.webp",
  "/HaoCabs/4.webp",
  "/HaoCabs/7.webp",
  "/HaoCabs/cover-720.webp",
  "/tiffinly/1-1200.webp",
  "/tiffinly/3.webp",
  "/tiffinly/6.webp",
  "/tiffinly/10.webp",
];

/**
 * Column count of the collage grid. Cells are 16:9, so the grid subdivides the
 * frame's own ratio evenly with no cropping beyond the hairline gap.
 */
export const COLLAGE_COLUMNS = 4;

/** True when a card at this index sits in the final row and spans two columns. */
export function spansTwoColumns(index: number): boolean {
  const remainder = heroCollageImages.length % COLLAGE_COLUMNS;
  if (remainder !== 2) return false;
  return index >= heroCollageImages.length - 2;
}

/**
 * Milliseconds between each card's entrance.
 *
 * Was 70ms across 30 cards, which assembled the whole collage in ~2s and read
 * as a flood. The brief is deliberately slow: 200ms across 14 cards takes ~3s,
 * so each piece of work is legible before the next arrives.
 */
export const COLLAGE_STAGGER_MS = 200;

/**
 * Height of the hero scroll track, in viewport heights.
 *
 * The stage is `position: sticky`, so this is not the height of the hero — it
 * is the extra scroll distance the visitor travels while the hero stays pinned.
 *
 * Was 420vh, then 200vh. That history was solving a problem the dwell floors
 * already solve: the gates only ever DELAY a stage, so the minimum time on each
 * beat is enforced by LOGOS_DWELL_MS / COLLAGE_DWELL_MS regardless of how hard
 * the visitor scrolls. A long track therefore bought no extra pacing and cost a
 * lot of scrolling through a stage that was only waiting on a timer.
 *
 * At 150vh the pin distance is half a viewport, so clearing the hero is a short
 * flick rather than a chore. The gates stay scroll-usable because they are
 * FRACTIONS of the pin distance, not fixed offsets — they rescale with this
 * constant for free, landing at 14vh / 23vh / 32vh of travel here.
 *
 * The floor worth respecting: the collage gate (0.64) must stay far enough into
 * the pin that an ordinary scroll reaches it. Below roughly 140vh the gate lands
 * inside a single flick, every stage releases on its timer instead of on scroll,
 * and cutting further buys no speed — it only starts truncating the collage.
 */
export const HERO_TRACK_VH = 150;

/**
 * Scroll-progress gates, as a fraction of the pinned scroll distance.
 *
 * The sequence is scroll-GATED, not scroll-SCRUBBED: crossing a gate releases
 * the next stage, but nothing is ever driven backwards mid-tween or tied to
 * scroll velocity. Scrubbing would mean the video seeking with the scrollbar,
 * which is why `preload`/`playsInline` behaviour here stays a normal play().
 *
 * The gates are spaced so the stages read as distinct beats rather than one
 * continuous motion.
 */
export const HERO_GATES = {
  /** Scroll needed before the client logos are allowed in. */
  video: 0.28,
  /** Scroll needed before the logos shrink and the collage builds. */
  logos: 0.46,
  /** Scroll needed before the collage recedes into the slideshow. */
  collage: 0.64,
} as const;

/**
 * Minimum time each stage must be on screen before the next gate can release
 * it. Gating alone is not enough: a fast flick scrolls past every gate in a
 * single frame, which is exactly the "coming too fast" problem the slow pacing
 * was meant to solve. Dwell guarantees a floor on how long a beat lasts no
 * matter how hard the visitor scrolls; the gates then only ever *delay* a
 * stage the dwell would have released anyway.
 */
export const LOGOS_DWELL_MS = 3000;

/**
 * Derived, never hand-tuned: the collage cannot be released before its last
 * card has landed, so the dwell is the full stagger plus one card's tween. A
 * literal here would silently break the moment the image list or the stagger
 * changed — which is the whole reason this lives next to both.
 */
export const COLLAGE_DWELL_MS = COLLAGE_STAGGER_MS * heroCollageImages.length + 900;

/** How long each full-frame slide is held before the next one crossfades in. */
export const SLIDE_MS = 2800;
