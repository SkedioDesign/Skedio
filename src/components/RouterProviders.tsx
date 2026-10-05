import type { ReactNode } from "react";
import { ContactModalProvider } from "@/context/contact-modal-context";
import { ContactModal } from "@/components/ContactModal";

/**
 * The contact modal and its context, for the entire router.
 *
 * These used to be rendered by RootComponent, which is the root route's
 * component — and a route's `errorComponent` REPLACES that component when it
 * catches. So ErrorFallback rendered with no provider above it, SiteHeader's
 * `useContactModal()` threw, and the error page took itself down: the handler
 * for an error was guaranteed to fail while showing an error. The root route's
 * `notFoundComponent` has the same problem for the same reason.
 *
 * The router's `Wrap` option sits outside the route tree entirely, so both
 * fallbacks render inside the provider, and the modal they open still works.
 *
 * Non-DOM-rendering only, as `Wrap`'s docs require. `ContactModal` qualifies:
 * it portals to <body>, so it contributes no markup at this position and cannot
 * shift the document.
 */
export function RouterProviders({ children }: { children: ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactModal />
    </ContactModalProvider>
  );
}
