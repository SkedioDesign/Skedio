// Client-side Sentry helper. Initialization happens in src/instrument.client.ts
// (deferred until main-thread idle); this module only reports errors, and is
// inert when Sentry hasn't been configured/initialized.
//
// The SDK is imported DYNAMICALLY (never statically) so it stays out of the
// critical JS bundle: no static `import "@sentry/…"` may exist on the client
// module graph outside instrument.client.ts, or Rollup will hoist the whole
// SDK back into the initial chunks. Reporting is best-effort and never throws.

import type * as SentryTypes from "@sentry/tanstackstart-react";

export interface ClientErrorContext {
  tag?: string;
  extra?: Record<string, unknown>;
}

export function captureClientError(error: unknown, context?: ClientErrorContext): void {
  if (typeof window === "undefined") return;
  import("@sentry/tanstackstart-react")
    .then((Sentry) => {
      if (!Sentry.getClient()) return;
      Sentry.withScope((scope: SentryTypes.Scope) => {
        if (context?.tag) scope.setTag("source", context.tag);
        if (context?.extra) {
          for (const [key, value] of Object.entries(context.extra)) {
            scope.setExtra(key, value);
          }
        }
        Sentry.captureException(error);
      });
    })
    .catch(() => {
      /* Reporting is best-effort; never break the app if Sentry fails. */
    });
}
