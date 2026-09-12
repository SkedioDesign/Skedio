import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/schema";
import { openCookieSettings } from "@/lib/analytics";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: seo({
      title: `Privacy Policy | ${siteConfig.name}`,
      description: `Learn how ${siteConfig.name} collects, protects, and manages your data responsibly.`,
      url: "/privacy",
    }),
    links: canonicalLink("/privacy"),
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" },
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData data={breadcrumbSchema} />

      {/* Header */}
      <div className="border-b border-border/70 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to Skédio
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-[900px] px-6 py-16 md:py-24">
        <p className="eyebrow">Legal &amp; Privacy</p>
        <h1 className="type-h1 mt-4">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-foreground/85 sm:text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Overview</h2>
            <p>
              Skédio ("we," "our," or "us") respects your privacy and is committed to protecting any
              personal data collected through our website (
              <a href={siteConfig.url} className="text-primary underline">
                {siteConfig.url}
              </a>
              ) and client communications.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
            <p>We may collect information you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Contact Information:</strong> Name, email address, company name, and project
                requirements submitted via inquiry forms or email.
              </li>
              <li>
                <strong>Analytics &amp; Usage Data:</strong> Anonymized site interaction metrics
                (pages visited, time on page, device type) used solely to enhance performance. This
                is only collected if you accept optional analytics cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. How We Use Information</h2>
            <p>We use collected information strictly to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to inquiries and prepare project proposals.</li>
              <li>Deliver design and development services under contractual agreement.</li>
              <li>Maintain site security, prevent spam, and improve user experience.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal data to third parties.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Cookies and Tracking</h2>
            <p>
              We use necessary cookies that are essential for the site to function. We do not use
              any tracking or advertising cookies, and we do not collect analytics data without your
              consent.
            </p>
            <p>
              When you first visit the site, you may be offered the choice to accept optional
              analytics cookies. These are only activated after you accept, and only collect
              anonymized usage metrics to help us improve the site. Your choice is stored in your
              browser and used strictly to respect your preference.
            </p>
            <p>You can change your cookie preferences at any time:</p>
            <button
              type="button"
              onClick={openCookieSettings}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-105 active:scale-95 cursor-pointer"
            >
              Manage Cookie Preferences
            </button>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures to safeguard your
              data against unauthorized access, loss, or alteration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-primary font-medium underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
