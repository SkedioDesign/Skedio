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
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

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
                requirements submitted via inquiry forms, email, or phone.
              </li>
              <li>
                <strong>Newsletter Subscriptions:</strong> Email addresses provided through the
                newsletter sign-up field in our footer. We use these only to send occasional studio
                updates and announcements.
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
              <li>
                Send email updates to newsletter subscribers. You can opt out at any time by
                replying "unsubscribe" or emailing{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary font-medium underline"
                >
                  {siteConfig.email}
                </a>
                .
              </li>
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
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-foreground/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 text-foreground/85">
                  <tr>
                    <td className="px-4 py-3 font-medium">skedio-analytics-consent</td>
                    <td className="px-4 py-3">Local storage</td>
                    <td className="px-4 py-3">
                      Stores whether you accepted or declined analytics. Essential — we use it to
                      respect your choice.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Umami Analytics</td>
                    <td className="px-4 py-3">No cookies</td>
                    <td className="px-4 py-3">
                      Privacy-friendly, cookieless usage metrics. Loaded only after you accept
                      analytics.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <h2 className="text-2xl font-bold text-foreground">5. Third-Party Processors</h2>
            <p>
              We share information only with trusted service providers who help us operate the site.
              Each processor is contractually bound to use your data only for the purposes we
              define:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Vercel Inc.</strong> — website hosting and content delivery.
              </li>
              <li>
                <strong>FormSubmit</strong> — routes contact form and newsletter submissions to our
                inbox.
              </li>
              <li>
                <strong>Umami Software</strong> — cookieless, privacy-friendly web analytics
                (enabled only with your consent).
              </li>
              <li>
                <strong>Sentry</strong> — error and performance monitoring to keep the site stable.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Data Retention</h2>
            <p>
              We retain contact information and project communications only for as long as needed to
              respond to your inquiry or perform our services, and then for a reasonable period
              thereafter for record-keeping and legal purposes. Newsletter subscriber emails are
              retained until you unsubscribe. Aggregated, anonymized analytics cannot be traced back
              to you and are retained for as long as they remain useful for improving the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures to safeguard your
              data against unauthorized access, loss, or alteration. Transmissions to third-party
              processors are encrypted using HTTPS.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access</strong> the personal data we hold about you.
              </li>
              <li>
                <strong>Rectify</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erase</strong> your data ("right to be forgotten"), where applicable.
              </li>
              <li>
                <strong>Restrict</strong> or object to certain processing activities.
              </li>
              <li>
                <strong>Data portability</strong> — receive your data in a structured,
                machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time (e.g. delete your analytics preference
                or unsubscribe from updates) without affecting the lawfulness of prior processing.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-primary font-medium underline">
                {siteConfig.email}
              </a>
              . We will respond within 30 days. You may also lodge a complaint with your local data
              protection authority.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">9. Children's Privacy</h2>
            <p>
              Our website and services are intended for business and professional audiences and are
              not directed to children under 13. We do not knowingly collect personal information
              from children. If you believe a child has provided us with personal data, please
              contact us so we can delete it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">10. International Transfers</h2>
            <p>
              Some of our service providers (e.g. Vercel, Umami, FormSubmit) may process data on
              servers located outside your country of residence. Where such transfers occur, we rely
              on appropriate safeguards, including standard contractual clauses where required by
              applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or legal requirements. The "Last updated" date above will be revised, and
              material changes will be highlighted on this page. Continued use of the site after
              changes are posted constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">12. Contact Us</h2>
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
