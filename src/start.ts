import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(async () => {
  if (!import.meta.env.SSR) {
    // Client: server request/function middleware never executes in the
    // browser, so return bare options WITHOUT importing the Sentry SDK.
    // A static `@sentry/*` import here would hoist the entire SDK into the
    // critical client bundle (start.ts ships to the browser for hydration),
    // defeating the idle-deferred Sentry init — Rolldown even warns about it
    // (INEFFECTIVE_DYNAMIC_IMPORT). The client reports errors via the
    // lazily-loaded SDK in instrument.client.ts / lib/sentry-client.ts.
    return {};
  }
  // Server: the SDK import is fine (server bundle, never render-blocking),
  // and the middleware must be present before the server handles requests.
  const { sentryGlobalFunctionMiddleware, sentryGlobalRequestMiddleware } =
    await import("@sentry/tanstackstart-react");
  return {
    requestMiddleware: [sentryGlobalRequestMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware],
  };
});
