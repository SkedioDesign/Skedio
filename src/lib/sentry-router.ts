// Handoff for the TanStack Router instance used by Sentry's browser tracing.
//
// Background: client Sentry.init() is intentionally DEFERRED until the main
// thread goes idle (see src/instrument.client.ts), so the router tracing
// integration can no longer be added synchronously at router creation time
// (there is no Sentry client yet — the call would be silently dropped and
// navigation tracing lost). Instead, getRouter() stashes the client-side
// instance here, and the deferred init picks it up and passes it to
// tanstackRouterBrowserTracingIntegration. Error capture + session replay
// are unaffected by this handoff.
//
// Type-only import: erased at compile time, so this module adds zero bytes
// and creates no runtime import cycle with src/router.tsx.
import type { AnyRouter } from "@tanstack/react-router";

let clientRouter: AnyRouter | null = null;

export function setClientRouterForSentry(router: AnyRouter): void {
  if (!clientRouter) clientRouter = router;
}

export function getClientRouterForSentry(): AnyRouter | null {
  return clientRouter;
}
