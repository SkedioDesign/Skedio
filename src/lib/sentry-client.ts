// Client-side Sentry facade. The DSN is supplied via VITE_SENTRY_DSN (the DSN
// is public at runtime) and everything here is inert until it is configured.
// The SDK itself is loaded dynamically so it never lands in the server bundle.

let dsn: string | undefined;
try {
  dsn = import.meta.env["VITE_SENTRY_DSN"] as string | undefined;
} catch {
  dsn = undefined;
}

let initStarted = false;

function loadSdk(): Promise<typeof import("@sentry/react")> {
  return import("@sentry/react");
}

export function initClientSentry(): void {
  if (!dsn || typeof window === "undefined" || initStarted) return;
  initStarted = true;
  void loadSdk().then((Sentry) => {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE ?? "development",
      tracesSampleRate: 0,
    });
  });
}

export interface ClientErrorContext {
  tag?: string;
  extra?: Record<string, unknown>;
}

export function captureClientError(error: unknown, context?: ClientErrorContext): void {
  if (!dsn || typeof window === "undefined") return;
  void loadSdk().then((Sentry) => {
    Sentry.withScope((scope) => {
      if (context?.tag) scope.setTag("source", context.tag);
      if (context?.extra) {
        for (const [key, value] of Object.entries(context.extra)) {
          scope.setExtra(key, value);
        }
      }
      Sentry.captureException(error);
    });
  });
}
