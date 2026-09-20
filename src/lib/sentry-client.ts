// Client-side Sentry helper. Initialization happens in src/instrument.client.ts
// (imported first from src/client.tsx); this module only reports errors, and is
// inert when Sentry hasn't been configured/initialized.

import * as Sentry from "@sentry/tanstackstart-react";

export interface ClientErrorContext {
  tag?: string;
  extra?: Record<string, unknown>;
}

export function captureClientError(error: unknown, context?: ClientErrorContext): void {
  if (typeof window === "undefined" || !Sentry.getClient()) return;
  Sentry.withScope((scope) => {
    if (context?.tag) scope.setTag("source", context.tag);
    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(error);
  });
}
