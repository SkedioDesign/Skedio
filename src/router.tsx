import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getCurrentNonce } from "./lib/nonce-context";
import { RouterProviders } from "./components/RouterProviders";

export function getRouter() {
  const nonce = getCurrentNonce();
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    // Outside the route tree, so ErrorFallback and NotFound render inside the
    // contact-modal context. See RouterProviders for the full reasoning.
    Wrap: RouterProviders,
    ssr: {
      ...(nonce ? { nonce } : {}),
    },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
