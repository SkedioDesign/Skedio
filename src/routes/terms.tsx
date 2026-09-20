import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: seo({
      title: `Terms & Conditions | ${siteConfig.name}`,
      description: `Terms and conditions governing the use of ${siteConfig.name}'s website and creative studio services.`,
      url: "/terms",
    }),
    links: canonicalLink("/terms"),
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Terms & Conditions", item: "/terms" },
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
        <p className="eyebrow">Legal &amp; Terms</p>
        <h1 className="type-h1 mt-4">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-foreground/85 sm:text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using the website operated by Skédio ("Studio," "we," "us"), you agree
              to be bound by these Terms &amp; Conditions. If you do not agree, please discontinue
              use of the website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              2. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, case studies, graphics, logos, images,
              and code — is the property of Skédio or its respective client licensors and is
              protected by copyright, trademark, and intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              3. Client Engagements
            </h2>
            <p>
              All professional services (product design, visual identity, UI/UX design, software
              development) are governed by specific Master Services Agreements (MSA) and Statements
              of Work (SOW) executed between Skédio and the client.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              4. Payments, Refunds &amp; Cancellations
            </h2>
            <p>
              Payment schedules, deposits, refund policy, and cancellation terms for professional
              services are defined individually for each engagement and are set out in the
              applicable Master Services Agreement (MSA) and Statement of Work (SOW). No payment or
              refund terms on this website, by themselves, constitute a binding offer. Any refunds
              are issued solely in accordance with the terms agreed in writing for the specific
              project.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              5. Limitation of Liability
            </h2>
            <p>
              The materials on this website are provided on an "as-is" basis. Skédio makes no
              warranties, expressed or implied, and hereby disclaims all other warranties including
              without limitation, implied warranties of merchantability or fitness for a particular
              purpose. To the maximum extent permitted by law, in no event shall Skédio be liable
              for any indirect, incidental, special, consequential, or punitive damages arising out
              of or relating to your use of the website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">6. External Links</h2>
            <p>
              The website may contain links to third-party websites or services (such as LinkedIn,
              Instagram, and Behance). We are not responsible for the content, privacy practices, or
              availability of these external sites. Visiting them is at your own discretion and
              subject to their own terms and policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">7. Privacy</h2>
            <p>
              Your use of the website is also governed by our{" "}
              <Link to="/privacy" className="text-primary font-medium underline">
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India,
              without regard to its conflict of law provisions. Any disputes arising under these
              Terms shall be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              9. Changes to These Terms
            </h2>
            <p>
              We may revise these Terms at any time by updating this page. The "Last updated" date
              above will be revised accordingly. By continuing to use the website after changes are
              posted, you accept the revised Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              10. Severability &amp; Waiver
            </h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining
              provisions shall continue in full force and effect. Our failure to enforce any right
              or provision of these Terms shall not be considered a waiver of that right or
              provision.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">11. Inquiries</h2>
            <p>
              Questions regarding these Terms should be directed to{" "}
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
