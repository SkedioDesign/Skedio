// Server-side Sentry helper. Initialization happens in instrument.server.mjs
// (loaded via --import and/or imported at the top of src/server.ts); this module
// only reports errors, and is inert when Sentry hasn't been initialized.

import * as Sentry from "@sentry/tanstackstart-react";
import { describeError } from "./error-capture";

export function captureServerError(error: unknown, source?: string): void {
  console.error(describeError(error));
  if (!Sentry.getClient()) return;
  Sentry.withScope((scope) => {
    if (source) scope.setTag("source", source);
    Sentry.captureException(error);
  });
}

// Serverless functions may be frozen before the async transport finishes, so
// flush pending events when returning an error response.
export async function flushServerErrors(timeoutMs = 2_000): Promise<void> {
  if (Sentry.getClient()) await Sentry.flush(timeoutMs);
}
