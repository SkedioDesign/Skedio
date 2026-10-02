import { useEffect, useRef } from "react";
import {
  PAGE_LOADER_CLASS,
  PAGE_LOADER_EXIT_MS,
  PAGE_LOADER_GIF_MS,
  PAGE_LOADER_MAX_MS,
  PAGE_LOADER_MIN_MS,
  notePageLoaderExit,
  pageLoaderArmed,
  pageLoaderExitStartedAt,
} from "@/lib/page-loader";

/**
 * Intro overlay: the page's first paint is this, then it hands over to the
 * hero. Server-rendered so the GIF starts downloading at HTML-parse time — by
 * the time JS boots there is no blank frame left to fill.
 *
 * It renders unconditionally; VISIBILITY belongs to CSS, gated on the
 * `.sk-preloader-pending` class the inline boot script puts on <html> (see
 * lib/page-loader.ts). Two consequences worth keeping:
 *
 *   - With JS off, or on a reduced-motion machine, or on the second page of a
 *     session, the class is never added and the overlay is `visibility: hidden`
 *     from the first frame. It costs nothing and covers nothing.
 *   - The timers below therefore only ever run in the one case where they are
 *     meaningful; in every other case the effect returns on its first line.
 *
 * NO REACT STATE, DELIBERATELY. `data-state` is written straight to the node
 * and nothing here re-renders. This document's React tree is rebuilt once after
 * hydration — the `js` class that gates the scroll reveals also makes <html>
 * mismatch the server-rendered attributes, and React rebuilds rather than
 * patching — which unmounts and remounts every component in it. A phase held in
 * `useState` gets reset by that rebuild mid-exit, and the overlay never comes
 * down: measured in dev, the crossfade started, React tore the component out,
 * the fresh instance began again from scratch, and an opaque loader sat over a
 * fully loaded page. Writing to the DOM also means React has nothing to fight
 * over, since it never renders these attributes.
 */
export function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    const gif = gifRef.current;
    // Deliberately NOT `root.classList.contains(PAGE_LOADER_CLASS)`: React
    // empties that class attribute when it commits after hydration, so the
    // check is only true for the first ~1.2s. pageLoaderArmed() is the durable
    // record of the boot script's decision.
    if (!el || !pageLoaderArmed()) return;

    const timers: number[] = [];
    const schedule = (delayMs: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, Math.max(0, delayMs)));
    };

    let finished = false;
    let observer: MutationObserver | null = null;

    const finish = () => {
      finished = true;
      observer?.disconnect();
      // `display: none`, not the `visibility: hidden` the base state uses: a
      // visibility-hidden image is still animated by the compositor, and this
      // one is 27 frames of 1080x1080 that would otherwise loop for the life of
      // the page behind the page.
      el.setAttribute("data-state", "done");
      // Also the only thing that releases the scroll lock the armed class sets.
      root.classList.remove(PAGE_LOADER_CLASS);
    };

    let played = false;
    const playExit = () => {
      if (played) return;
      played = true;
      const startedAt = pageLoaderExitStartedAt();
      // A remount can land mid-crossfade. The fresh node comes up fully visible
      // again, because the armed class is still on <html>, so the exit has to be
      // replayed against it — picking up wherever the previous instance got to
      // rather than starting the whole fade again.
      const elapsed = startedAt === null ? 0 : performance.now() - startedAt;
      if (elapsed >= PAGE_LOADER_EXIT_MS) {
        finish();
        return;
      }
      // Wakes the hero entrance (lib/page-loader.ts) so its timeline starts as
      // the overlay starts leaving rather than underneath it.
      notePageLoaderExit();
      el.setAttribute("data-state", "leaving");
      schedule(PAGE_LOADER_EXIT_MS - elapsed, finish);
    };

    // The exit needs BOTH halves: the document ready, and the GIF played out.
    //
    // The GIF half is not decoration. This asset loops forever (NETSCAPE2.0), so
    // there is no `ended` event, and a timer started from mount is measuring the
    // wrong thing entirely — on a warm cache `performance.now()` is already past
    // PAGE_LOADER_MIN_MS by the time this effect runs, which made the overlay
    // dismiss on `load` even while the GIF was still downloading. Gating on the
    // <img> becoming decodable, then waiting one full PAGE_LOADER_GIF_MS cycle,
    // is what makes the animation actually finish before the page takes over.
    let docReady = false;
    let gifCycleDone = false;
    const maybeExit = () => {
      if (docReady && gifCycleDone) playExit();
    };

    // Keep the armed class on <html>, because React takes it away.
    //
    // The class is the whole reason CSS shows the overlay, and React's
    // post-hydration commit recreates <html> and empties its class attribute —
    // boot script armed it at 81ms, React cleared it at 1220ms. Until this was
    // noticed the overlay was vanishing ~1.2s in on every cold load, mid-GIF,
    // with all of the timers below still counting. Re-arming on the mutation is
    // the smallest thing that survives React without moving visibility out of
    // CSS.
    observer = new MutationObserver(() => {
      // Past the hard cap the backstop owns the screen; re-arming past it would
      // override the boot script's own FAILSAFE_MS timer and strand the visitor.
      if (finished || performance.now() >= PAGE_LOADER_MAX_MS) {
        observer?.disconnect();
        return;
      }
      if (!root.classList.contains(PAGE_LOADER_CLASS)) root.classList.add(PAGE_LOADER_CLASS);
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const onGifLoad = () => {
      // One cycle of the looped GIF, timed from the moment it can first paint.
      schedule(PAGE_LOADER_GIF_MS, () => {
        gifCycleDone = true;
        maybeExit();
      });
    };

    const onLoad = () => {
      docReady = true;
      maybeExit();
    };

    window.addEventListener("load", onLoad);
    // A cached GIF can be complete before this effect ever runs, in which case
    // `load` has already fired and will not fire again.
    if (gif?.complete && gif.naturalWidth > 0) onGifLoad();
    else gif?.addEventListener("load", onGifLoad, { once: true });
    // Aesthetic floor — see PAGE_LOADER_MIN_MS. Also covers a document already
    // `complete` by hydration time, where `load` will never fire again.
    schedule(PAGE_LOADER_MIN_MS - performance.now(), onLoad);
    // Backstop — see PAGE_LOADER_MAX_MS. Forces BOTH halves, so an image that
    // never becomes decodable still releases the screen.
    schedule(PAGE_LOADER_MAX_MS - performance.now(), () => {
      docReady = true;
      gifCycleDone = true;
      maybeExit();
    });
    // Resume an exit that a remount interrupted, if there was one.
    if (pageLoaderExitStartedAt() !== null) playExit();

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onLoad);
      observer?.disconnect();
      // Deliberately NOT un-arming the class here. StrictMode runs this cleanup
      // between its two effect invocations, before a single timer has fired, so
      // releasing on cleanup blanks the loader in dev and does nothing in
      // production. finish() is the one place that releases it; if the bundle
      // never gets that far, the boot script's own timer does.
    };
  }, []);

  return (
    // Positioning, box and `display` all live in the `.sk-preloader` block in
    // styles.css rather than in utility classes — see the note there on why
    // this one element is not built from Tailwind classes.
    <div ref={ref} data-page-loader="" role="status" aria-live="polite" className="sk-preloader">
      <span className="sr-only">Loading Skédio</span>
      <img
        ref={gifRef}
        src="/video/loading.gif"
        alt=""
        aria-hidden="true"
        width={1080}
        height={1080}
        decoding="async"
        className="sk-preloader-gif h-auto w-[min(46vmin,300px)] object-contain"
      />
    </div>
  );
}
