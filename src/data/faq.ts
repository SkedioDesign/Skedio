export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const generalFaqs: FAQItem[] = [
  {
    question: "What services does Skédio provide?",
    answer:
      "Skédio is a creative studio specializing in Brand Strategy, Brand Identity Design, UI/UX Design, and Full-Stack Digital Product Development. We partner with startups and scaling businesses to take products from idea to launch.",
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
      "Brand strategy and identity sprints typically take 3 to 5 weeks. Full UI/UX product design engagements take 4 to 8 weeks, while end-to-end MVP design and development typically ranges from 8 to 14 weeks.",
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
];
