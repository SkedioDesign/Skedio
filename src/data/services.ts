export interface DeliverableItem {
  title: string;
  description?: string;
}

export type ServiceDeliverable = string | DeliverableItem;

export interface ServiceItem {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  definition: string; // Direct quotable one-liner for AEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  themeColor: string;
  primaryCta?: string;
  secondaryCta?: string;
  eyebrow?: string;
  deliverablesEyebrow?: string;
  deliverablesHeading?: string;
  deliverablesIntro?: string;
  targetAudienceHeading?: string;
  highlights?: string[];
  bannerHeading?: string;
  bannerSubheading?: string;
  deliverables: ServiceDeliverable[];
  processEyebrow?: string;
  processHeading?: string;
  processIntro?: string;
  process: Array<{ step: string; title: string; description: string }>;
  targetAudience: string[];
  faqs: Array<{ question: string; answer: string }>;
}

/*
 * ORDER IS EDITORIAL AND LOADS EVERYWHERE. This array is the single source for
 * the "What we do" accordion, the /services hub grid, the homepage hero pills
 * and the numbered 01-04 indices — so reordering here moves all four together.
 *
 * UI/UX Design leads and Website Development follows: they are the two services
 * most visitors arrive looking for, and they read as a natural pair (design the
 * product, then build it), which puts the two craft-led offers ahead of the
 * broader brand and campaign work.
 */
export const servicesData: ServiceItem[] = [
  {
    slug: "ui-ux-design",
    title: "UI/UX Design Services for Websites, Apps & Digital Products",
    shortTitle: "UI/UX Design",
    tagline:
      "We design intuitive, user-friendly websites and apps that people enjoy using and come back to.",
    definition:
      "UI/UX design is the process of turning a business problem into a digital product people actually want to use. At Skédio, we handle everything from user research and wireframes to interactive prototypes and usability testing, and deliver a launch-ready product with a complete design system.",
    metaTitle: "UI/UX Design Services for Websites, Apps & Digital Products | Skédio",
    metaDescription:
      "We design intuitive, user-friendly websites and apps that people enjoy using and come back to. Complete UI/UX design with research, wireframes, prototypes, and design systems.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    primaryCta: "Start Your UI/UX Design Project",
    secondaryCta: "See Our UI/UX Process",
    deliverablesHeading: "What's Included in Our UI/UX Design Services",
    deliverablesIntro:
      "Every project comes with clear, documented deliverables and developer-ready files, so your product is easy to build, launch, and scale.",
    targetAudienceHeading: "Who our UI/UX design services are for",
    highlights: [
      "Sprint-based delivery",
      "Validated interactive prototypes",
      "Scalable design system",
    ],
    bannerHeading: "Ready to build an intuitive, high-converting product?",
    bannerSubheading:
      "Let’s talk through your goals, user flows, and product timeline. We’ll outline a sprint-based plan tailored to your launch.",
    targetAudience: [
      "Startups designing a new product before writing a single line of code",
      "SaaS and B2B platforms looking to simplify complex workflows",
      "Mobile app (iOS and Android) teams improving engagement and retention",
      "Businesses redesigning websites or apps that users find confusing",
    ],
    deliverables: [
      {
        title: "UX Research & Product Discovery",
        description:
          "User interviews, competitor analysis, and strategy sprints that define what to build.",
      },
      {
        title: "Product Strategy, User Journeys & Information Architecture",
        description: "Clear user flows and site structure that make your product easy to navigate.",
      },
      {
        title: "Low-Fidelity & High-Fidelity Wireframes",
        description:
          "Screen-by-screen layouts that map every state, from first click to final action.",
      },
      {
        title: "Interactive Figma Prototypes & Usability Testing",
        description: "Clickable prototypes tested with real users before development begins.",
      },
      {
        title: "Design System & Developer Handoff",
        description:
          "Reusable components, design tokens, and organized files your developers can build from directly.",
      },
    ],
    processHeading: "Our 4-Step UI/UX Design Process",
    processIntro:
      "A clear, sprint-based process that removes guesswork and delivers your design on time.",
    process: [
      {
        step: "01",
        title: "Discovery & Product Strategy",
        description:
          "We review your current product, speak with stakeholders and users, and define the goals and key user journeys.",
      },
      {
        step: "02",
        title: "Information Architecture & Wireframing",
        description:
          "We organize your content and flows, then build wireframes covering every screen, edge case, and screen size.",
      },
      {
        step: "03",
        title: "Prototyping & UI Design",
        description:
          "We turn wireframes into interactive prototypes, test them with users, and polish the visual design with clean typography, subtle motion, and accessible contrast.",
      },
      {
        step: "04",
        title: "Design System & Developer Handoff",
        description:
          "We deliver a reusable design system with components, tokens, and interaction states, and work with your developers so the final build matches the design.",
      },
    ],
    faqs: [
      {
        question: "What is included in a UI/UX design engagement?",
        answer:
          "A UI/UX design engagement at Skédio includes product discovery and user research, product strategy, journey mapping, information architecture, low- and high-fidelity wireframes, interactive prototypes, usability testing, and a production-ready design system with developer handoff.",
      },
      {
        question: "How long does a UI/UX design project take?",
        answer:
          "A UI/UX design engagement typically spans 4 to 8 weeks depending on product complexity and the number of flows being reworked, covering research, strategy, wireframes, visual design, and interactive prototyping.",
      },
      {
        question: "Can we start a UI/UX engagement before we have a product or customers?",
        answer:
          "Yes. Most of our UI/UX work happens pre-launch: we help founders define the product, pressure-test assumptions with lightweight research, and ship a prototype ready for real users.",
      },
      {
        question: "How do you incorporate user research and usability testing?",
        answer:
          "We run stakeholder interviews, competitor teardowns, and lightweight usability tests on interactive prototypes at key decision points. Findings feed directly into the flows and screens, so the design decisions are based on observed user behavior instead of assumptions.",
      },
      {
        question: "Do you provide Figma design files and developer handoff?",
        answer:
          "Yes, we provide organized, component-driven Figma files with auto-layout, documented design tokens, interactive prototypes, and developer specs.",
      },
      {
        question: "How do you hand off designs to our own engineering team?",
        answer:
          "We hand off component-driven Figma files with auto-layout, documented design tokens, annotated developer specs, and interactive prototypes. We also run an alignment session with your engineers so implementation stays true to the system.",
      },
    ],
  },
  {
    slug: "website-development",
    title: "Website Development Services for Startups & Growing Brands",
    shortTitle: "Website Development",
    tagline:
      "Fast, responsive, custom websites designed and built to look sharp, load quickly, and grow with your business.",
    definition:
      "Website development is the process of turning a design into a working website that loads fast, works on every device, and helps visitors become customers. At Skédio, the same team that designs your brand also builds your site, so your look, your message, and your code stay perfectly in sync.",
    metaTitle: "Website Development Services for Startups & Growing Brands | Skédio",
    metaDescription:
      "Fast, responsive, custom websites designed and built to look sharp, load quickly, and grow with your business. Custom design, CMS, SEO, and ongoing support.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    primaryCta: "Start Your Website Project",
    secondaryCta: "See Our Development Process",
    deliverablesHeading: "What's Included in Our Website Development Services",
    deliverablesIntro:
      "Every project includes a fully built, tested, and launch-ready website, so you get a site that is easy to manage, quick to load, and ready to be found on Google.",
    targetAudienceHeading: "Who our website development services are for",
    highlights: ["Custom design & build", "Mobile-first & SEO-ready", "Launch & ongoing support"],
    bannerHeading: "Ready to launch a fast, high-converting website?",
    bannerSubheading:
      "Let’s discuss your goals, features, and launch timeline. We’ll map out a clear technical plan and build your site from the ground up.",
    targetAudience: [
      "Startups and new businesses launching their first website",
      "Local and emerging brands that need a professional online presence",
      "Businesses with outdated or slow websites that need a redesign and rebuild",
      "Founders who want design and development handled by one team",
    ],
    deliverables: [
      {
        title: "Custom Website Design & Development",
        description: "A unique website built around your brand and goals, not a recycled template.",
      },
      {
        title: "Responsive, Mobile-First Development",
        description: "Pages that look and work smoothly on phones, tablets, and desktops.",
      },
      {
        title: "CMS Integration & Easy Content Management",
        description:
          "A simple admin setup so you can update text, images, and pages without touching code.",
      },
      {
        title: "Speed, Performance & On-Page SEO",
        description:
          "Optimized images and clean code, plus proper headings, meta tags, and site structure to help you rank.",
      },
      {
        title: "Testing, Launch & Ongoing Support",
        description:
          "Cross-browser and device testing, a smooth launch, and support afterward for fixes and updates.",
      },
    ],
    processHeading: "Our 4-Step Website Development Process",
    processIntro:
      "A clear, step-by-step process that takes your website from an approved design to a live, high-performing site, with updates at every stage.",
    process: [
      {
        step: "01",
        title: "Planning & Technical Scoping",
        description:
          "We confirm your goals, pages, features, and platform, then map out the structure and timeline.",
      },
      {
        step: "02",
        title: "Design-to-Code Development",
        description:
          "We turn the approved design into clean, responsive code, built page by page to match the design exactly.",
      },
      {
        step: "03",
        title: "Integration, Testing & Optimization",
        description:
          "We add forms, CMS, and any integrations, then test across devices and browsers and optimize for speed and SEO.",
      },
      {
        step: "04",
        title: "Launch & Support",
        description:
          "We take your site live, check everything in the real environment, and stay available for updates and improvements.",
      },
    ],
    faqs: [
      {
        question: "What tech stacks do you specialize in?",
        answer:
          "We specialize in TypeScript, React, TanStack Start, Next.js, Node.js, Tailwind CSS, PostgreSQL, and cloud deployments on Vercel and AWS.",
      },
      {
        question: "Do you offer post-launch support and retainers?",
        answer:
          "Yes, we offer ongoing maintenance, feature iteration, and performance optimization retainers for launched products.",
      },
      {
        question: "Can you take over existing codebases?",
        answer:
          "Yes, we conduct comprehensive code audits and can modernize, refactor, or build on top of existing repositories.",
      },
      {
        question: "How long does it take to build an MVP?",
        answer:
          "A scoped MVP with core features typically takes 6 to 10 weeks, including design and development. Complexity, integrations, and the breadth of the feature set are the main variables — we lock real timing in the proposal after discovery.",
      },
      {
        question: "Do you handle hosting, deployment, and infrastructure?",
        answer:
          "Yes. We configure deployment pipelines, edge CDNs, monitoring, logging, and cloud infrastructure on Vercel or AWS as part of delivery. We also offer ongoing maintenance and security oversight after launch.",
      },
      {
        question: "How do you estimate cost and scope for a development project?",
        answer:
          "We run a discovery and architecture workshop, then break the product into features and effort to produce a phased, milestone-based estimate. You pay per agreed milestone rather than by nebulous hourly effort.",
      },
    ],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity Design Services for Startups & Growing Brands",
    shortTitle: "Brand Identity",
    tagline:
      "Logos, colors, typography, and guidelines that give your brand a consistent, recognizable identity from day one.",
    definition:
      "Brand identity design is how your business looks, sounds, and feels everywhere people meet it, from your logo and colors to your website, packaging, and social media. At Skédio, we start with strategy and build a complete visual identity system, so your brand looks consistent, builds trust, and stands out from competitors.",
    metaTitle: "Brand Identity Design Services for Startups & Growing Brands | Skédio",
    metaDescription:
      "Logos, colors, typography, and guidelines that give your brand a consistent, recognizable identity from day one. Strategy, logos, design systems, and brand guidelines.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    primaryCta: "Start Your Brand Identity Project",
    secondaryCta: "See Our Branding Process",
    deliverablesHeading: "What's Included in Our Brand Identity Design Services",
    deliverablesIntro:
      "Every project includes a complete, ready-to-use identity with files and guidelines, so your brand looks the same on every platform and in every format.",
    targetAudienceHeading: "Who our brand identity services are for",
    highlights: [
      "Strategy-led identity",
      "Scalable logo & asset kit",
      "Full brand guidelines book",
    ],
    bannerHeading: "Ready to give your brand a distinctive, memorable identity?",
    bannerSubheading:
      "Let’s define your brand’s personality, strategy, and visual language. We’ll build a complete identity system built to stand out.",
    targetAudience: [
      "Startups and new businesses creating a brand from scratch",
      "Local and emerging brands that want to look professional and trustworthy",
      "Established businesses ready for a rebrand or a refreshed look",
      "Founders who are tired of juggling separate designers for logo, website, and marketing",
    ],
    deliverables: [
      {
        title: "Brand Discovery & Positioning",
        description:
          "Research on your audience and competitors, plus a clear positioning that shows what makes your brand different.",
      },
      {
        title: "Logo Design & Logo Variations",
        description:
          "A primary logo with horizontal, stacked, and icon versions that work on websites, social media, and print.",
      },
      {
        title: "Color Palette & Typography System",
        description:
          "Carefully chosen brand colors and fonts that set the tone and stay consistent across every touchpoint.",
      },
      {
        title: "Visual Identity System",
        description:
          "Icons, patterns, imagery style, and graphic elements that extend your logo into a full brand look.",
      },
      {
        title: "Brand Guidelines & Brand Collateral",
        description:
          "A clear brand book and ready-to-use assets such as business cards, stationery, and social media templates.",
      },
    ],
    processHeading: "Our 4-Step Brand Identity Design Process",
    processIntro:
      "A clear, step-by-step process that takes your brand from an early idea to a finished identity, with your feedback at every stage.",
    process: [
      {
        step: "01",
        title: "Discovery & Brand Strategy",
        description:
          "We learn about your business, audience, and competitors, then define your brand's purpose, personality, and positioning.",
      },
      {
        step: "02",
        title: "Concept & Logo Design",
        description:
          "We explore creative directions and sketch logo concepts, then refine the strongest one with your feedback.",
      },
      {
        step: "03",
        title: "Visual Identity System",
        description:
          "We build out your colors, typography, icons, and graphic elements so the logo works as part of a complete system.",
      },
      {
        step: "04",
        title: "Brand Guidelines & Launch Assets",
        description:
          "We deliver your brand book and final files, plus the assets you need to launch with a consistent look everywhere.",
      },
    ],
    faqs: [
      {
        question: "What files and formats do we receive at handoff?",
        answer:
          "You receive vector master files (SVG, EPS, AI), high-res web assets (PNG, WebP), font files/licenses, social media avatar kits, and a complete brand guidelines PDF with digital design tokens.",
      },
      {
        question: "How many design concepts do you present?",
        answer:
          "We typically present 2 to 3 distinct creative concepts during the exploratory phase and iterate on the chosen direction until perfection.",
      },
      {
        question: "How much does brand identity design cost?",
        answer:
          "Brand identity pricing depends on scope, deliverables, and company scale. Contact us for a tailored proposal matching your timeline and milestones.",
      },
      {
        question: "How do you ensure a logo works across apps, packaging, and social media?",
        answer:
          "We stress-test every concept — from a 16px favicon to large-format print — on digital apps, packaging, social avatars, and merchandise before finalizing. You receive flexible lockups, clear-space rules, and responsive variants so the mark stays legible everywhere it appears.",
      },
      {
        question: "Can you adapt an existing identity, or do we need a full redesign?",
        answer:
          "Both paths are covered by the same audit-first process. We assess the equity in your current marks and systems, then recommend a targeted refresh that keeps what works and evolves the rest, or a full redesign when a category reset is what you need.",
      },
      {
        question: "How long does a complete brand identity project take?",
        answer:
          "A full identity project typically takes 3 to 5 weeks, including concept exploration, refinement, real-world mockups, and the final design system and brand guidelines.",
      },
    ],
  },
  {
    slug: "marketing-creatives",
    eyebrow: "Marketing Creatives Studio",
    title: "Marketing Creatives & Social Media Design for Growing Brands",
    shortTitle: "Marketing Creatives",
    tagline:
      "Eye-catching social media posts, ad creatives, and campaign designs that get your brand noticed and keep it consistent everywhere.",
    definition:
      "Marketing creatives are the visual assets that carry your brand's message to your audience, including social media posts, ad banners, campaign graphics, and promotional materials. At Skédio, the team that builds your brand identity also designs your marketing creatives, so every post and ad looks like it belongs to the same brand and drives real attention and action.",
    metaTitle:
      "Marketing Creatives & Social Media Design for Growing Brands | Skédio",
    metaDescription:
      "Eye-catching social media posts, ad creatives, and campaign designs that get your brand noticed and keep it consistent everywhere.",
    ogImage: "/og.webp",
    themeColor: "#8537F4",
    primaryCta: "Start Your Marketing Project",
    secondaryCta: "See Our Creative Process",
    deliverablesEyebrow: "What's Included",
    deliverablesHeading: "What's Included in Our Marketing Creative Services",
    deliverablesIntro:
      "Every project includes ready-to-publish designs in the right sizes and formats, so your brand shows up consistently on every platform without extra work on your side.",
    targetAudienceHeading: "Who our marketing creative services are for",
    highlights: ["Multi-platform sizing", "Editable brand templates", "High-converting ad visuals"],
    bannerHeading: "Ready to elevate your social media & ad creatives?",
    bannerSubheading:
      "Let’s craft scroll-stopping marketing assets and campaign visuals that keep your brand consistent and drive real engagement.",
    targetAudience: [
      "Startups and new brands launching on social media for the first time",
      "Local and emerging businesses that need regular, professional-looking content",
      "Brands running ads or campaigns that need strong visuals",
      "Founders who want marketing designs that match their brand identity and website",
    ],
    deliverables: [
      {
        title: "Social Media Post & Story Design",
        description:
          "Scroll-stopping static posts, carousels, and stories designed for Instagram, LinkedIn, Facebook, and more.",
      },
      {
        title: "Ad Creatives & Campaign Design",
        description:
          "Display ads, banners, and campaign visuals built to catch attention and encourage clicks.",
      },
      {
        title: "Social Media Templates & Content Kits",
        description:
          "Editable templates in your brand style, so your team can post consistently and quickly.",
      },
      {
        title: "Promotional & Launch Materials",
        description:
          "Posters, flyers, email graphics, and launch assets for product releases, events, and offers.",
      },
      {
        title: "Motion Graphics & Short-Form Video Creatives",
        description:
          "Animated posts, reels covers, and short branded clips that perform well on social platforms.",
      },
    ],
    processEyebrow: "Our Creative Process",
    processHeading: "Our 4-Step Marketing Creative Process",
    processIntro:
      "A clear, repeatable process that turns your campaign goals into polished, on-brand designs, with your feedback at every stage.",
    process: [
      {
        step: "01",
        title: "Brief & Strategy",
        description:
          "We learn about your goals, audience, platforms, and brand guidelines, then agree on the message and content plan.",
      },
      {
        step: "02",
        title: "Concept & Creative Direction",
        description:
          "We explore visual ideas and layouts that fit your brand and the platform, then align on one direction with you.",
      },
      {
        step: "03",
        title: "Design & Refinement",
        description:
          "We design the full set of creatives, gather your feedback, and refine them until they are ready to publish.",
      },
      {
        step: "04",
        title: "Delivery & Optimization",
        description:
          "We deliver final files in every format you need, and suggest tweaks based on how your content performs.",
      },
    ],
    faqs: [
      {
        question: "What is included in a marketing creatives engagement?",
        answer:
          "A marketing creatives engagement includes channel audit, campaign concepting and art direction, social and ad asset production in every required ratio, email and landing page design, and an editable template set with a brand style guide.",
      },
      {
        question: "Do you produce assets in every size each platform needs?",
        answer:
          "Yes. We export each concept across the placements it has to run in D feed, story, reel cover, carousel, display ad widths, and email D rather than one master image stretched to fit.",
      },
      {
        question: "Can we get templates we can use without you?",
        answer:
          "Yes. Every engagement ends with editable Figma and design templates plus a style guide covering type scale, colour, spacing, and do-and-don't examples, so your team can produce assets independently.",
      },
      {
        question: "How long does a creative cycle take?",
        answer:
          "A campaign cycle typically takes 2 to 4 weeks from kickoff to final delivery, depending on how many concepts and how many channel formats are in scope.",
      },
      {
        question: "Will the creative match our existing brand identity?",
        answer:
          "Yes. We work from your established identity D colour, type, and logo rules D and extend it into a campaign system rather than inventing a parallel look that drifts from the site.",
      },
      {
        question: "Do you work alongside our in-house marketing team?",
        answer:
          "Yes. We often act as the creative arm for an in-house team, taking the heavier production and system-building while they own the calendar and the copy.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}

/*
 * Resolve a project's `serviceSlugs` to real service records, preserving the
 * authored order and silently dropping slugs with no matching page. The
 * project -> service half of the link graph. Takes slugs rather than reading
 * `projects.ts` directly to keep this module free of a circular import.
 */
export function getServicesBySlugs(slugs: string[]): ServiceItem[] {
  return slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is ServiceItem => service !== undefined);
}
