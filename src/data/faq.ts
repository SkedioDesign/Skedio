export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const generalFaqs: FAQItem[] = [
  {
    question: "What services does Skédio provide?",
    answer:
      "Skédio is a creative studio specializing in Product Design, Brand Identity, Visual Design, and Full-Stack Digital Product Development. We partner with startups and scaling businesses to take products from idea to launch.",
    category: "General",
  },
  {
    question: "How much does a brand identity or UI/UX design project cost?",
    answer:
      "Every project is customized based on scope, deliverables, and timeline. Engagements range from focused identity sprints to comprehensive end-to-end product design and engineering. Contact us via our inquiry form for a detailed proposal and transparent pricing.",
    category: "Pricing & Engagement",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Product design engagements typically take 4 to 8 weeks, identity sprints 3 to 5 weeks, while end-to-end MVP design and development usually ranges from 8 to 14 weeks.",
    category: "Timeline",
  },
  {
    question: "Do you work with startups and early-stage founders?",
    answer:
      "Yes. A significant portion of our clients are early-stage startups and funded ventures needing high-conviction branding, pitch decks, and MVP prototypes to raise capital and acquire their initial users.",
    category: "Clients",
  },
  {
    question: "How does the design and development collaboration process work?",
    answer:
      "We operate with weekly sprint milestones, asynchronous Figma walkthroughs, and direct communication channels (Slack/Discord/Email). You have full visibility into wireframes, design systems, and code repositories throughout the project.",
    category: "Process",
  },
  {
    question: "Where is Skédio located and do you work with international clients?",
    answer:
      "Skédio is based in India and serves clients worldwide across North America, Europe, Asia, and the Middle East, operating across global timezones seamlessly.",
    category: "General",
  },
  {
    question: "How many revision rounds are included in a project?",
    answer:
      "Every deliverable includes structured feedback rounds, typically two to three per milestone, captured clearly in Figma comments or shared docs. This keeps changes scoped and on schedule. Objective pivots outside the agreed scope are handled as small, separately quoted additions rather than open-ended revisions.",
    category: "Process",
  },
  {
    question: "How does Skédio approach startups differently from established brands?",
    answer:
      "For startups, we move fast on tightly scoped sprints — positioning, identity, and MVP design that is investor-ready and launch-focused. For established brands, we dig deeper: stakeholder alignment, category repositioning, and scalable design systems that protect long-term equity during transformation.",
    category: "Clients",
  },
  {
    question: "Should we start with brand identity or product design first?",
    answer:
      "Always start with strategy. Positioning, audience, and messaging are the foundation on which a distinctive visual identity is built — and product design flows from the same product truths. Starting with a logo before that foundation is set usually means redoing the design once the strategy firms up.",
    category: "General",
  },
  {
    question: "Who owns the final deliverables and source files?",
    answer:
      "You do, fully. On completion of the final milestone, you receive ownership of all source files — design systems, vector assets, code repositories, and documentation — with no ongoing licensing or lock-in.",
    category: "Pricing & Engagement",
  },
  {
    question: "How do we get a project started with Skédio?",
    answer:
      "Reach out through our inquiry form or email hello@skedio.studio. We reply within one to two business days, set up a discovery call to understand your goals, budget, and timeline, and come back with a proposal covering scope, deliverables, and pricing. Most projects begin within two weeks of that call.",
    category: "Process",
  },
];
