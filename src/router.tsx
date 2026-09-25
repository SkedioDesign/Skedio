import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getCurrentNonce } from "./lib/nonce-context";
import { setClientRouterForSentry } from "./lib/sentry-router";

export function getRouter() {
  const nonce = getCurrentNonce();
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    ssr: {
      ...(nonce ? { nonce } : {}),
    },
  });

  if (!router.isServer) {
    // Sentry.init() is deferred until main-thread idle (see
    // src/instrument.client.ts), so the router tracing integration cannot be
    // added here (no client exists yet). Stash the instance; the deferred
    // init picks it up. Navigation tracing is preserved, just started late.
    setClientRouterForSentry(router);
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
