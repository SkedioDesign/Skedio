// Imported from src/client.tsx BEFORE anything else so the module graph is
// established before hydration. Uses VITE_SENTRY_DSN when provided (see
// .env.example); otherwise the production DSN is baked in as a fallback so
// production builds report out of the box. Dev stays quiet unless
// VITE_SENTRY_DSN is explicitly set, to avoid polluting the project.
//
// LCP: Sentry.init() is intentionally DEFERRED until the main thread goes
// idle (well after the hero LCP). Initializing synchronously would open a
// connection to the ingest origin (o4512119811014656.ingest.us.sentry.io)
// and start session-replay recording during the critical rendering path,
// competing with the LCP hero image + critical CSS + above-fold fonts.
// No preconnect hint is emitted for the ingest origin for the same reason —
// the connection is only opened post-LCP. All functionality (error capture,
// router tracing via lib/sentry-router.ts, replay sampling) is preserved,
// just started late.

import { getClientRouterForSentry } from "./lib/sentry-router";

const PRODUCTION_DSN =
  "https://88f660be68a0db7956197e40b3b2194f@o4512119811014656.ingest.us.sentry.io/4512119824449536";

const configured = (import.meta.env["VITE_SENTRY_DSN"] as string | undefined)?.trim();

const dsn = configured || (import.meta.env.PROD ? PRODUCTION_DSN : "");

function initSentry() {
  if (!dsn) return;
  // Dynamic import keeps the entire Sentry SDK out of the critical JS bundle
  // (no static `@sentry/*` import may exist on the client graph, or Rollup
  // hoists the SDK back into the initial chunks). Resolves to a single async
  // chunk shared with the best-effort reporter in lib/sentry-client.ts.
  import("@sentry/tanstackstart-react")
    .then((Sentry) => {
      if (Sentry.getClient()) return;
      // Router tracing can't be added at router creation time anymore (no
      // client exists until this deferred init runs), so pick up the instance
      // stashed by getRouter() — see lib/sentry-router.ts. Navigation tracing
      // is preserved, just started after LCP like everything else here.
      const router = getClientRouterForSentry();
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE?.trim() || "production",
        integrations: [
          Sentry.replayIntegration(),
          ...(router ? [Sentry.tanstackRouterBrowserTracingIntegration(router)] : []),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    })
    .catch(() => {
      /* Reporting is best-effort; never break the app if Sentry fails. */
    });
}

if (dsn && typeof window !== "undefined") {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(initSentry, { timeout: 3000 });
  } else {
    window.setTimeout(initSentry, 2000);
  }
}
