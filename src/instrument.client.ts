import * as Sentry from "@sentry/tanstackstart-react";
// Imported from src/client.tsx BEFORE anything else so Sentry initializes
// before hydration and captures early browser errors. Uses VITE_SENTRY_DSN when
// provided (see .env.example); otherwise the production DSN is baked in as a
// fallback so production builds report out of the box. Dev stays quiet unless
// VITE_SENTRY_DSN is explicitly set, to avoid polluting the project.

const PRODUCTION_DSN =
  "https://88f660be68a0db7956197e40b3b2194f@o4512119811014656.ingest.us.sentry.io/4512119824449536";

const configured = (import.meta.env["VITE_SENTRY_DSN"] as string | undefined)?.trim();

const dsn = configured || (import.meta.env.PROD ? PRODUCTION_DSN : "");

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE?.trim() || "production",
    integrations: [Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
