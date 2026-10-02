import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useContactForm } from "@/hooks/use-contact-form";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getBreadcrumbSchema, getContactPageSchema, getWebPageSchema } from "@/lib/schema";

const PROJECT_TYPES = [
  "Brand Identity",
  "UI/UX Design",
  "Website Development",
  "Marketing Creatives",
  "Something else",
] as const;

const WHAT_HAPPENS_NEXT = [
  {
    step: "01",
    title: "We read every inquiry",
    body: "No automated triage or ticket queue. A person on the team reads your message and decides who is the right person to reply.",
  },
  {
    step: "02",
    title: `We reply within ${siteConfig.responseTime}`,
    body: "You get a real response with either answers to your questions or a short call link to talk it through.",
  },
  {
    step: "03",
    title: "We scope the work",
    body: "If it looks like a fit, we put together a clear scope, timeline, and price before anything is signed.",
  },
];

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "India — working worldwide",
    href: null,
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: PROJECT_TYPES[0] as string,
    message: "",
  });

  const { status, errorMessage, honey, handleHoneyChange, submit, reset, isSubmitting } =
    useContactForm({
      getBody: (honey) => ({
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType,
        message: formData.message,
        _subject: `New Project Inquiry from ${formData.name} — ${formData.projectType} (Skedio Studio)`,
        _template: "table",
      }),
      onSent: () =>
        setFormData({ name: "", email: "", projectType: PROJECT_TYPES[0], message: "" }),
    });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <>
      <SiteHeader
        links={[
          { label: "Home", to: "/" },
          { label: "Work", to: "/projects" },
          { label: "Services", to: "/services" },
          { label: "Blog", to: "/blog" },
          { label: "Contact", current: true },
        ]}
      />
      <main className="pt-28 md:pt-36">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <Breadcrumbs
            items={[
              { name: "Home", item: "/" },
              { name: "Contact", item: "/contact" },
            ]}
            className="mb-10"
          />

          <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="eyebrow">Get in touch</span>
                <Sparkles className="size-3.5 text-primary" />
              </div>

              <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Tell us what you're building
              </h1>

              <p className="type-body mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Whether you need a brand, a product, or both, we want to hear about it. Send the
                {`details below and a real person on the team will get back to you within ${siteConfig.responseTime}.`}
              </p>

              <ul className="mt-10 space-y-5 border-t border-border/70 pt-8">
                {contactDetails.map((detail) => {
                  const Icon = detail.icon;
                  const content = (
                    <>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {detail.label}
                        </span>
                        <span className="mt-1 block text-base font-medium text-foreground">
                          {detail.value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={detail.label}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="flex items-center gap-4 rounded-xl transition-opacity hover:opacity-70"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/60 p-7 sm:p-9">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <h2 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
                    Message sent
                  </h2>
                  <p className="type-body mt-3 max-w-sm text-muted-foreground">
                    Thanks {formData.name ? `, ${formData.name.split(" ")[0]}` : ""} — your message
                    {`reached our inbox. We'll reply within ${siteConfig.responseTime}.`}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:border-primary hover:text-primary"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="inline-flex items-center gap-2">
                    <span className="eyebrow">Start a project</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Start a Conversation
                  </h2>

                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honey}
                    onChange={handleHoneyChange}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-page-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-page-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-page-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-page-email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. rahul@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-page-type"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      What do you need?
                    </label>
                    <select
                      id="contact-page-type"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full cursor-pointer rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-page-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Project Details <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="contact-page-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your product, your goals, and any timelines you are working with."
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full resize-y rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="text-sm text-destructive">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowUpRight className="size-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Prefer email? Reach us directly at{" "}
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>

          <section
            className="border-t border-border/70 py-16 md:py-24"
            aria-labelledby="what-happens"
          >
            <h2
              id="what-happens"
              className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              What happens next
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {WHAT_HAPPENS_NEXT.map((item) => (
                <div key={item.step} className="rounded-2xl border border-border/70 p-7">
                  <span className="font-display text-4xl font-extrabold text-primary/25">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="type-body mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <StructuredData
        data={[
          getContactPageSchema("/contact"),
          getWebPageSchema({
            path: "/contact",
            name: "Contact Skédio — Start a Brand or Product Project",
            description:
              "Tell Skédio about your brand or digital product. A reply within 24 hours.",
          }),
        ]}
      />
      <StructuredData
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
        ])}
      />
    </>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: seo({
      title: "Contact Skédio — Start a Brand or Product Project",
      description: `Get in touch with Skédio about UI/UX design, brand identity, website development, or marketing creatives. We reply to every inquiry within ${siteConfig.responseTime}.`,
      url: "/contact",
      type: "website",
    }),
    links: canonicalLink("/contact"),
  }),
  component: Contact,
});
