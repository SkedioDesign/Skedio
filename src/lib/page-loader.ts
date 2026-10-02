/**
 * Intro loader — the one-shot overlay that covers the first paint, shared with
 * the homepage hero entrance it hands the screen off to.
 *
 * RESPONSIBILITY SPLIT (deliberate, and the reason this lives in a module
 * rather than inside the component):
 *
 *   CSS owns "is it visible". The overlay markup is server-rendered so its GIF
 *   is discovered on the very first HTML parse, but only an inline class on
 *   <html> can reveal it. That class is added before first paint by
 *   PAGE_LOADER_BOOT_SCRIPT below, so nothing is ever hidden waiting for a
 *   bundle that may not arrive — the same progressive-enhancement rule the
 *   `.js .sk-hero-start` and `.js .sk-reveal-base` states already use.
 *
 *   JS owns "when does it go away", because only JS knows when the document has
 *   finished loading. PageLoader.tsx does that, but note it does so by writing
 *   to the DOM directly, NOT through React state: this document's React tree is
 *   rebuilt once after hydration (the `js` class above makes <html> mismatch
 *   the server-rendered attributes), which unmounts and remounts every
 *   component. A `useState` phase is silently reset by that rebuild at the worst
 *   possible moment, and the overlay never comes down. The exit timestamp below
 *   is module state precisely so a remount can pick the exit back up.
 */

/** Reveals the overlay. Added to <html> by PAGE_LOADER_BOOT_SCRIPT. */
export const PAGE_LOADER_CLASS = "sk-preloader-pending";

/** sessionStorage key recording that this tab session has already seen it. */
const SEEN_KEY = "sk-preloader-seen";

/**
 * Floor for how long the overlay stays up, measured from navigation start.
 * Without it a warm cache crossesfades in ~2 frames and reads as a flicker
 * rather than an intro.
 */
export const PAGE_LOADER_MIN_MS = 1100;

/**
 * Hard cap. A slow connection (or a resource that never finishes) must not
 * strand a visitor behind a loading screen — after this the overlay comes down
 * whatever the state of the load event.
 *
 * Also the backstop for the GIF gate: if the image never becomes decodable at
 * all (blocked, 404, still streaming on a bad connection) the overlay will not
 * wait for a cycle that cannot start.
 *
 * MUST stay above PAGE_LOADER_GIF_MS + PAGE_LOADER_EXIT_MS, or the backstop
 * fires while a full cycle is still legitimately playing and truncates it. It
 * also has to leave room for the GIF to *download* inside that budget: the exit
 * waits for both, so a cap of GIF_MS + EXIT_MS would truncate the loop for any
 * connection slower than the crossfade. 9000ms buys ~3.4s of load time on top of
 * the 5s cycle; the cost is that a genuinely bad connection now sits in front
 * of the page for up to 9s. Lower it toward ~6s if that trade ever goes the
 * other way, but the loop will start getting cut on slow connections.
 */
export const PAGE_LOADER_MAX_MS = 9000;

/** Crossfade duration. Must stay in sync with --sk-preloader-fade in styles.css. */
export const PAGE_LOADER_EXIT_MS = 600;

/**
 * Duration of ONE full cycle of /video/loading.gif.
 *
 * The GIF carries a NETSCAPE2.0 loop extension (loop count 0 = forever), so it
 * never "ends" — there is no `ended` event to wait on, and a timer started from
 * mount is the wrong reference, because the GIF may still be downloading when
 * the exit timer starts. The exit is therefore gated on one full cycle elapsing
 * from the moment the <img> reports it is decodable (see PageLoader.tsx), and
 * this is how long that cycle is.
 *
 * 5000ms across 27 frames, i.e. [130, 140, 30, 130, 40, 100, 30, 130, 40, 130,
 * 30, 170, 2770, 30, 130, 40, 100, 30, 130, 40, 130, 30, 140, 30, 130, 40,
 * 130] — read off the shipped file with Pillow. Note the 2770ms tail: most of
 * the cycle is one long held frame, not animation, so the perceived "wait" is
 * much longer than the frame count suggests.
 *
 * Re-derive after replacing the asset (`PIL.Image.open(path)` and sum
 * `info["duration"]` per frame) or the overlay will cut the loop short.
 */
export const PAGE_LOADER_GIF_MS = 5000;

/**
 * If the bundle errors out, hydration never commits, or React wedges, the
 * overlay must still come down. This lives in the inline boot script rather than
 * in the CSS (which could fade the overlay but not release the scroll lock the
 * armed class sets) and rather than in the bundle (which is the thing that
 * might be broken). Measured from HTML parse, so it is a genuine backstop
 * behind PAGE_LOADER_MAX_MS rather than a competitor to it.
 */
const FAILSAFE_MS = 11000;

/**
 * Inline boot script, mounted through `head.scripts` in __root.tsx so it runs
 * before first paint AND picks up the CSP nonce (ssr.nonce in router.tsx) — a
 * raw <script> would be blocked by `script-src 'self' 'nonce-…'`.
 *
 * Two conditions have to pass before the loader is shown at all:
 *
 *   once per session — SPA navigations never re-render the document, so this
 *   only ever gates the first page of a tab session. Replaying it on every
 *   route load would be the classic preloader's sin, and the GIF would then
 *   compete with the LCP image on every cold navigation. This is also why the
 *   loader will not reappear on a manual refresh of an already-visited tab:
 *   clear sessionStorage, or open a fresh tab, to see it again.
 *
 *   not under reduced motion — a decorative looped GIF covering the whole
 *   viewport is precisely what `prefers-reduced-motion` asks not to be shown,
 *   so these visitors get the page directly instead of a delayed one.
 *
 * The session flag is written *before* revealing, so a document that never
 * hydrates does not replay the loader on the next reload.
 */
export const PAGE_LOADER_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${SEEN_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;sessionStorage.setItem("${SEEN_KEY}","1");window.__skPreloaderArmed=1;d.classList.add("${PAGE_LOADER_CLASS}");}catch(e){return;}setTimeout(function(){d.classList.remove("${PAGE_LOADER_CLASS}");},${FAILSAFE_MS});})();`;

/**
 * Longest the hero entrance will hold for a loader that never reports in.
 * Without it a failed handoff would park `.sk-hero-start` at `opacity: 0`
 * forever — the failure mode this whole design is trying to avoid.
 */
const HANDOFF_BACKSTOP_MS = 1500;

/**
 * Whether the boot script above decided to show the overlay.
 *
 * This reads a JS global rather than the DOM on purpose. React recreates <html>
 * when it commits after hydration, and that commit wipes *everything* on the
 * element — the armed class, any data attribute, any inline style. Measured: the
 * boot script armed `sk-preloader-pending` at 81ms and React emptied the class
 * attribute at 1220ms, which dismissed the overlay mid-GIF no matter what the
 * exit timers decided. A global survives that, so it is the only honest record
 * of the original decision.
 */
export function pageLoaderArmed(): boolean {
  return typeof window !== "undefined" && window.__skPreloaderArmed === 1;
}

/** Fired on `window` the instant the overlay starts fading. */
const EXIT_EVENT = "sk:pageloader:exit";

/**
 * When the overlay started leaving, as `performance.now()`, or null if it never
 * has. Module state rather than a DOM event alone, because hydration can land
 * AFTER the event has already fired once, and a listener would then wait out
 * the full backstop for an exit that already happened.
 */
let exitStartedAt: number | null = null;

/** Called by PageLoader.tsx when the overlay begins to come down. Idempotent. */
export function notePageLoaderExit(): void {
  if (exitStartedAt !== null) return;
  exitStartedAt = performance.now();
  window.dispatchEvent(new Event(EXIT_EVENT));
}

/** ms since navigation start at which the exit began, or null if not yet. */
export function pageLoaderExitStartedAt(): number | null {
  return exitStartedAt;
}

/**
 * Resolves once the screen has been (or is being) handed to the page — the
 * moment the homepage hero entrance should start, so its ~1.3s timeline is not
 * spent playing invisibly behind the overlay.
 *
 * Resolves immediately when there is no loader to wait for (repeat view,
 * reduced motion, or a document whose script never armed the class), and after
 * HANDOFF_BACKSTOP_MS if one is somehow left up.
 */
export function afterPageLoaderExit(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // pageLoaderArmed(), not classList.contains(): React empties <html>'s class
  // attribute on its post-hydration commit, and reading it here would report "no
  // loader" and start the hero entrance behind a still-visible overlay.
  if (exitStartedAt !== null || !pageLoaderArmed()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let backstop = 0;
    const settle = () => {
      if (backstop) window.clearTimeout(backstop);
      window.removeEventListener(EXIT_EVENT, settle);
      resolve();
    };
    backstop = window.setTimeout(settle, HANDOFF_BACKSTOP_MS);
    window.addEventListener(EXIT_EVENT, settle);
  });
}
