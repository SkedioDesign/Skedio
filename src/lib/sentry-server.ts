import * as Sentry from "@sentry/node";
import { describeError } from "./error-capture";

const dsn = process.env["SENTRY_DSN"];
const enabled = Boolean(dsn);

if (enabled) {
  Sentry.init({
    dsn,
    environment: process.env["VERCEL_ENV"] ?? process.env["NODE_ENV"] ?? "development",
    release: process.env["VERCEL_GIT_COMMIT_SHA"] || undefined,
    tracesSampleRate: 0,
  });
}

export function captureServerError(error: unknown, source?: string): void {
  console.error(describeError(error));
  if (!enabled) return;
  Sentry.withScope((scope) => {
    if (source) scope.setTag("source", source);
    Sentry.captureException(error);
  });
}

// Serverless functions may be frozen before the async transport finishes, so
// flush pending events when returning an error response.
export async function flushServerErrors(timeoutMs = 2_000): Promise<void> {
  if (enabled) await Sentry.flush(timeoutMs);
}
