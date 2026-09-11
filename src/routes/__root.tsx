import { useEffect, type ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Footer } from "../components/Footer";
import { smoothScroll } from "../lib/smooth-scroll";
import { ContactModalProvider } from "../context/contact-modal-context";
import { ContactModal } from "../components/ContactModal";
import { StructuredData } from "../components/StructuredData";
import { getOrganizationSchema, getWebSiteSchema } from "../lib/schema";
import { siteConfig } from "../lib/site-config";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.name },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/skedio-logomark.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    smoothScroll.init();
    return () => smoothScroll.destroy();
  }, []);

  return (
    <RootDocument>
      <ContactModalProvider>
        <Outlet />
        <ContactModal />
        {!pathname.startsWith("/projects") && <Footer />}
      </ContactModalProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
