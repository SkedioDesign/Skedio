import { siteConfig } from "@/lib/site-config";

export interface FAQItem {
  question: string;
  /**
   * The prose lead. Always a complete sentence, so it is safe to render or read
   * on its own — which is what happens in any context that does not know about
   * `bullets`, and what a search engine reads if the list is ever dropped.
   */
  answer: string;
  /**
   * Optional scannable list, rendered after `answer`. Held as data rather than
   * markdown because two consumers need it and they cannot share markup: the
   * accordion wants real `<li>` elements, and the FAQPage schema wants flat text.
   * Literal `**bold**` would leak asterisks into both.
   */
  bullets?: string[];
  /** Optional sentence rendered after `bullets`. Also folded into the schema. */
  closing?: string;
  category?: string;
  /**
   * Whether this FAQ belongs on the homepage. Set per item rather than derived
   * from an index list, so inserting or reordering an FAQ cannot silently move
   * a different question onto the page — and onto its schema markup with it.
   */
  homepage?: boolean;
}

/**
 * Every FAQ, in the order they were written. Placement is a separate concern
 * from content — see `homepageFaqs` below.
 */
export const generalFaqs: FAQItem[] = [
  {
    question: "What does a creative design studio do?",
    answer:
      "A creative design studio helps businesses build and present their brand through design. At Skédio, that means UI/UX design, brand identity, website development, and marketing creatives, all handled by one team. Instead of coordinating separate designers and developers, you get a consistent brand across your logo, website, and social media.",
    category: "General",
    homepage: true,
  },
  {
    question: "What services does Skédio offer?",
    answer:
      "Skédio offers four core services. You can hire us for one service or for your full brand journey.",
    bullets: [
      "Brand identity design: logos, colors, typography, and brand guidelines",
      "UI/UX design: websites and apps designed around how users think and behave",
      "Website development: fast, responsive, SEO-ready custom websites",
      "Marketing creatives: social media designs, ad creatives, and campaign visuals",
    ],
    category: "Services",
    homepage: true,
  },
  {
    question: "How is Skédio different from hiring separate freelancers?",
    answer:
      "When you hire separate freelancers for your logo, website, and social media, you handle the coordination and risk inconsistent results. Skedio is a studio, so one team handles your branding, design, and development together. This keeps your brand consistent, reduces back-and-forth, and saves you time. We also stay with your brand as it grows, instead of delivering a task and moving on.",
    category: "General",
    homepage: true,
  },
  {
    question: "Who does Skédio work with?",
    answer:
      "Skédio works mainly with startups, local businesses, and emerging brands that are just starting their journey. We also help established businesses that need a rebrand, a new website, or a fresh digital presence. If you are building something new and want to look professional from day one, we can help. We work with clients in Jabalpur, Bhopal, Mumbai and all over India.",
    category: "Clients",
    homepage: true,
  },
  {
    question: "How much does branding cost?",
    answer:
      "Branding cost depends on the scope of your project, such as logo only versus a full identity system with guidelines and marketing assets. At Skédio, brand identity projects start after a short discovery call. We send a clear proposal broken down by deliverable, so you know exactly what you are paying for.",
    category: "Pricing & Engagement",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Website cost depends on the number of pages, features, and whether you need custom design or e-commerce. At Skédio, we provide a detailed quote after understanding your goals, and it includes design, development, responsive testing, and basic on-page SEO setup.",
    category: "Pricing & Engagement",
  },
  {
    question: "How long does a typical project take?",
    answer: "Timelines depend on scope. As a general guide:",
    bullets: [
      "Brand identity: [2 to 3 weeks]",
      "UI/UX design: [3 to 6 weeks]",
      "Website development: [4 to 8 weeks]",
      "Marketing creatives: [a few days per batch, or ongoing monthly]",
    ],
    closing:
      "We share a clear timeline with milestones in your proposal, so you always know what to expect.",
    category: "Timeline",
  },
  {
    question: "What is included in a brand identity package?",
    answer:
      "A brand identity package from Skédio includes brand discovery and positioning, a primary logo with variations, a color palette and typography system, supporting graphic elements, and brand guidelines. We can also add collateral such as business cards, stationery, and social media templates. You receive all final files in formats ready for web and print.",
    category: "Services",
  },
  {
    question: "How many revisions are included, and will I own the final files?",
    answer:
      "Each project includes [2 rounds] of revisions at every key stage, so the design is refined with your feedback. Revisions cover adjustments and improvements, not a complete change of direction. Once the project is completed and paid for, you own the final files and assets, including source files where applicable.",
    category: "Process",
  },
  {
    question: "How do I start a project with Skédio?",
    answer: `Getting started is simple. Click "Let's Talk" and share a few details about your project. We reply within ${siteConfig.responseTime} to schedule a short discovery call, where we learn about your goals, audience, and budget. After that, we send a proposal with the scope, timeline, and cost, and we begin once you approve it. You can also email us at ${siteConfig.email}.`,
    category: "Process",
    homepage: true,
  },
];

/**
 * The homepage subset, per the placement note: FAQs 1–4 and 10.
 *
 * The cost and timeline answers are the ones held back — they belong on the
 * service pages, next to the work they describe, where a visitor can act on them
 * instead of reading a number with nothing to attach it to.
 */
export const homepageFaqs: FAQItem[] = generalFaqs.filter((faq) => faq.homepage);
