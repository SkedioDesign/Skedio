import * as Sentry from "@sentry/tanstackstart-react";

// Server-side Sentry init. Loaded on every execution path that runs the server
// entry:
//   • dev  – via `NODE_OPTIONS='--import ./instrument.server.mjs'` (package.json)
//   • local start – via node --import (package.json)
//   • Vercel serverless – imported as the first line of src/server.ts, so it is
//     bundled into the serverless function.
// Uses SENTRY_DSN when provided (see .env.example); otherwise the production DSN
// is baked in as a fallback so production deploys report out of the box. Local
// dev stays quiet unless SENTRY_DSN is explicitly set, to avoid noise.

const PRODUCTION_DSN =
  "https://88f660be68a0db7956197e40b3b2194f@o4512119811014656.ingest.us.sentry.io/4512119824449536";

const configured = (process.env.SENTRY_DSN || "").trim();

const dsn = configured || (process.env.NODE_ENV === "production" ? PRODUCTION_DSN : "");

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    tracesSampleRate: 1.0,
  });
}