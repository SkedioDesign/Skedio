import { type ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Footer } from "../components/Footer";
import { LenisProvider } from "../components/LenisProvider";
import { ContactModalProvider } from "../context/contact-modal-context";
import { ContactModal } from "../components/ContactModal";
import { StructuredData } from "../components/StructuredData";
import { getOrganizationSchema, getWebSiteSchema } from "../lib/schema";
import { siteConfig } from "../lib/site-config";
import { NotFound } from "../components/NotFound";
import { ErrorFallback } from "../components/ErrorFallback";
import { CookieConsent } from "../components/CookieConsent";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.name },
      // ──────────────────────────────────────────────────────────────────────
      // SEARCH CONSOLE VERIFICATION — PLACEHOLDERS
      // Replace these placeholder values with real codes before deploying:
      //   • Google:  search.google.com/search-console → Add property → "HTML tag" method
      //   • Bing:    www.bing.com/webmasters → verify site → "Meta tag" method
      // Keep "REPLACE_WITH_CODE" until you have real codes from each dashboard.
      // See docs/seo-verification.md for the alternative HTML-file method.
      // ──────────────────────────────────────────────────────────────────────
      { name: "google-site-verification", content: "REPLACE_WITH_CODE" },
      { name: "msvalidate.01", content: "REPLACE_WITH_CODE" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/skedio-logomark.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/android-chrome-512x512.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  errorComponent: ErrorFallback,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <LenisProvider>
      <RootDocument>
        <ContactModalProvider>
          <Outlet />
          <ContactModal />
          {!pathname.startsWith("/projects") && <Footer />}
          <CookieConsent />
        </ContactModalProvider>
      </RootDocument>
    </LenisProvider>
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
        <a href="#main-content" className="sk-skip-link">
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
