export interface Chapter {
  id: string;
  num: string;
  label: string;
}

export interface ImageRef {
  name: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Case study editorial content. One document per published (or in-progress)
 * project, keyed by slug. Markup markers inside headline/lede strings:
 *   "**text**" renders as .cs-accent, "##text##" renders in dark ink,
 *   newlines "\\n" render as line breaks.
 */
export interface CaseStudyDocument {
  slug: string;
  /** Base asset URL relative to /public, e.g. "/HaoCabs". */
  assets: string;
  /** Set true when the asset dir also ships .webp copies of every image. */
  hasWebp?: boolean;
  /** Brand wordmark shown in the sticky nav. */
  brand: string;
  /** Sticky-nav chapter progress (ids must match section ids). */
  chapters: Chapter[];
  sections: CaseStudySection[];
}

interface CoverSection {
  type: "cover";
  wordmark: Array<{ text: string; accent?: boolean }>;
  facts: Array<{ label: string; value: string }>;
  subtitle: string[];
  coverImage: ImageRef;
}

interface OverviewSection {
  type: "overview";
  id: string;
  num: string;
  kicker: string;
  index: Array<{ num: string; label: string }>;
  headline: string;
  lede: string;
  visual: ImageRef;
}

interface ChallengesSection {
  type: "challenge";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  problemWords: Array<{ base: string; strong: string }>;
  phoneCards: Array<{ image: ImageRef; offset?: "up" | "down" }>;
}

interface ProcessSection {
  type: "process";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  steps: Array<{ num: string; title: string; desc: string }>;
  visual: ImageRef;
}

interface Persona {
  title: string;
  role: string;
  variant: "rider" | "driver";
  pills: string[];
  phones: ImageRef[];
}

interface PersonasSection {
  type: "personas";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  personas: Persona[];
}

interface FinalSection {
  type: "final";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  showcase: ImageRef;
  journeyKicker: string;
  journey: Array<{ num: string; title: string; desc: string }>;
}

/**
 * Flexible editorial section used by non-app case studies (branding, campaigns…).
 * Renders any combination of: headline, lede paragraphs, tag pills, labeled
 * point blocks, a footnote paragraph, and one or more visuals.
 */
export interface EditorialSection {
  type: "editorial";
  id: string;
  num: string;
  kicker: string;
  theme?: "light" | "dark";
  headline?: string;
  lede?: string[];
  /** Small uppercase pill list, e.g. brand keywords or requirements. */
  tags?: string[];
  /** Labeled blocks with their own bullet list, e.g. colors or deliverables. */
  points?: Array<{ label?: string; items?: string[] }>;
  /** Closing paragraph that sits after tags/points. */
  footnote?: string;
  visual?: ImageRef;
  visuals?: ImageRef[];
}

interface EndingSection {
  type: "ending";
  word: string;
  tag: Array<{ text: string; accent?: boolean }>;
  visual: ImageRef;
  foot: string;
}

export type CaseStudySection =
  | CoverSection
  | OverviewSection
  | ChallengesSection
  | ProcessSection
  | PersonasSection
  | FinalSection
  | EditorialSection
  | EndingSection;

export const caseStudies: CaseStudyDocument[] = [
  {
    slug: "haocabs",
    assets: "/HaoCabs",
    hasWebp: true,
    brand: "HAO CABS",
    chapters: [
      { id: "overview", num: "01", label: "Overview" },
      { id: "challenges", num: "02", label: "Challenges" },
      { id: "process", num: "03", label: "Process" },
      { id: "personas", num: "04", label: "Personas" },
      { id: "final", num: "05", label: "Final" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "HAO" }, { text: "CABS", accent: true }],
        facts: [
          { label: "Platform", value: "Mobile App" },
          { label: "Discipline", value: "Product Design" },
          { label: "Scope", value: "UI/UX" },
          { label: "Year", value: "2026" },
        ],
        subtitle: ["A Taxi Bidding", "Experience App"],
        coverImage: {
          name: "1",
          alt: "HAO Cabs — Taxi bidding experience platform",
        },
      },
      {
        type: "overview",
        id: "overview",
        num: "01",
        kicker: "01) PROJECT OVERVIEW",
        index: [
          { num: "01", label: "Overview" },
          { num: "02", label: "Challenge" },
          { num: "03", label: "Approach" },
          { num: "04", label: "Design" },
          { num: "05", label: "Outcome" },
        ],
        headline: "A Smarter Way To\nBook, **Bid & Ride.**",
        lede: "Hao Cabs is a modern taxi-bidding platform that reimagines traditional ride booking through real-time driver bidding. Instead of fixed fares, riders can compare multiple offers from nearby drivers and choose the ride that best fits their needs.",
        visual: {
          name: "1",
          alt: "HAO Cabs product promotional visual and editorial artwork",
          width: 6000,
          height: 3375,
        },
      },
      {
        type: "challenge",
        id: "challenges",
        num: "02",
        kicker: "02) CHALLENGES",
        headline: "Giving Riders More Choice Without **Adding Complexity.**",
        lede: "Traditional ride-booking experiences often provide limited control over pricing and ride options. Hao Cabs needed a simple bidding experience that could give riders greater choice while keeping the booking process fast, clear, and easy to understand.",
        problemWords: [
          { base: "LIMITED", strong: "CONTROL" },
          { base: "FIXED", strong: "FARES" },
          { base: "FEWER", strong: "OPTIONS" },
        ],
        phoneCards: [
          {
            image: { name: "2", alt: "Available driver bids", width: 3375, height: 3375 },
            offset: "up",
          },
          {
            image: { name: "4", alt: "Ride request screen", width: 3375, height: 3375 },
          },
          {
            image: {
              name: "5",
              alt: "Fare comparison and bidding interface",
              width: 3375,
              height: 3375,
            },
            offset: "down",
          },
        ],
      },
      {
        type: "process",
        id: "process",
        num: "03",
        kicker: "03) DESIGN PROCESS",
        headline: "From Understanding The Problem To Designing The Experience.",
        lede: "The design process focused on understanding ride-booking pain points, mapping Rider and Driver journeys, exploring user flows, and progressively refining the interface through wireframes, prototypes, and high-fidelity UI design.",
        steps: [
          { num: "01", title: "DISCOVER", desc: "Understanding the problem" },
          { num: "02", title: "DEFINE", desc: "Rider & Driver journeys" },
          { num: "03", title: "EXPLORE", desc: "User flows & wireframes" },
          { num: "04", title: "REFINE", desc: "Prototypes & iterations" },
          { num: "05", title: "DELIVER", desc: "High-fidelity UI" },
        ],
        visual: {
          name: "6",
          alt: "HAO Cabs design system, user flows and interface fragments",
          width: 6000,
          height: 3375,
        },
      },
      {
        type: "personas",
        id: "personas",
        num: "04",
        kicker: "04) USER PERSONAS",
        headline: "Designing For The People Behind Every Ride.",
        lede: "User personas helped define the needs, motivations, and pain points of Hao Cabs' target users. The focus was on riders looking for affordable and reliable transportation, with features such as fare comparison, live tracking, secure payments, and scheduled rides supporting their everyday needs.",
        personas: [
          {
            title: "RIDER",
            role: "The Passenger",
            variant: "rider",
            pills: [
              "Fare comparison",
              "Live tracking",
              "Secure payments",
              "Scheduled rides",
              "Choosing a driver",
            ],
            phones: [
              { name: "2", alt: "Rider fare comparison", width: 3375, height: 3375 },
              { name: "5", alt: "Rider selecting a driver", width: 3375, height: 3375 },
            ],
          },
          {
            title: "DRIVER",
            role: "The Driver",
            variant: "driver",
            pills: [
              "Receiving ride requests",
              "Submitting bids",
              "Managing rides",
              "Navigation & earnings",
            ],
            phones: [
              { name: "4", alt: "Driver receiving ride requests", width: 3375, height: 3375 },
              { name: "7", alt: "Driver earnings and trip management", width: 6000, height: 3375 },
            ],
          },
        ],
      },
      {
        type: "final",
        id: "final",
        num: "05",
        kicker: "05) FINAL EXPERIENCE",
        headline: "A Transparent Ride-Booking Experience, From ##Bid To Destination.##",
        lede: "The final experience brings together real-time bidding, driver selection, OTP verification, live tracking, payments, scheduling, wallet management, and post-ride feedback into a unified mobile experience for Riders and Drivers.",
        showcase: {
          name: "3",
          alt: "HAO Cabs final mobile application — complete unified ride experience",
          width: 3375,
          height: 3375,
        },
        journeyKicker: "Product Story & Flow",
        journey: [
          { num: "01", title: "REQUEST", desc: "Passenger creates a ride request." },
          { num: "02", title: "BID", desc: "Nearby drivers submit their offers." },
          { num: "03", title: "CHOOSE", desc: "Passenger compares offers and selects a driver." },
          { num: "04", title: "VERIFY", desc: "OTP verification confirms the ride." },
          { num: "05", title: "TRACK", desc: "Passenger follows the ride in real time." },
          { num: "06", title: "PAY", desc: "Complete the payment securely." },
          {
            num: "07",
            title: "COMPLETE",
            desc: "Rate the experience and manage the trip afterward.",
          },
        ],
      },
      {
        type: "ending",
        word: "HAO CABS",
        tag: [{ text: "BID. " }, { text: "CHOOSE. ", accent: true }, { text: "RIDE." }],
        visual: {
          name: "1",
          alt: "HAO Cabs final brand statement artwork",
          width: 6000,
          height: 3375,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
  {
    slug: "edios",
    assets: "/EDIOS",
    brand: "EDIOS",
    chapters: [
      { id: "brief", num: "01", label: "Brief" },
      { id: "challenge", num: "02", label: "Challenge" },
      { id: "concept", num: "03", label: "Concept" },
      { id: "construction", num: "04", label: "Construction" },
      { id: "language", num: "05", label: "Language" },
      { id: "typography", num: "06", label: "Typography" },
      { id: "system", num: "07", label: "System" },
      { id: "applications", num: "08", label: "Applications" },
      { id: "direction", num: "09", label: "Direction" },
      { id: "outcome", num: "10", label: "Outcome" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "EDIOS", accent: true }],
        facts: [
          { label: "Industry", value: "Video Production & Cinematography" },
          { label: "Project", value: "Brand Identity / Logo Design" },
          { label: "Role", value: "Brand & Visual Identity Designer" },
          { label: "Deliverables", value: "Logo Mark, Wordmark, Color System, Applications" },
        ],
        subtitle: ["Ideas. Frames.", "Stories in Motion."],
        coverImage: {
          name: "1",
          alt: "EDIOS — Video Production Studio",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "brief",
        num: "01",
        kicker: "01 — THE BRIEF",
        headline: "From Freelance Work To\nA Dedicated **Studio.**",
        lede: [
          "EDIOS was created for a freelance filmmaker and video editor who wanted to take his individual creative work to the next level by establishing a dedicated video production studio.",
          "The goal was to create a visual identity that could represent his work across cinematography, video production, editing, and creative storytelling.",
        ],
        tags: [
          "Edgy",
          "Modern",
          "Bold",
          "Futuristic",
          "Production-focused",
          "Recognizable at small sizes",
        ],
        footnote:
          "The identity needed to feel like a production brand, rather than a personal freelancer logo.",
      },
      {
        type: "editorial",
        id: "challenge",
        num: "02",
        kicker: "02 — THE CHALLENGE",
        headline: "Film Language Without\nThe **Obvious Icons.**",
        lede: [
          "The visual identity needed to communicate the world of filmmaking without relying on predictable camera or film-strip icons.",
          "The challenge was to create something simple enough to work as a logo, while still having a strong connection with video production.",
          "The mark also needed to work across different environments — from camera setups and production equipment to digital platforms, merchandise, posters, and social media.",
        ],
      },
      {
        type: "editorial",
        id: "concept",
        num: "03",
        kicker: "03 — THE CONCEPT",
        theme: "dark",
        headline: "Two Visual Cues,\nOne **EDIOS Mark.**",
        lede: [
          "The EDIOS symbol is built around two familiar visual cues from the world of video production.",
        ],
        points: [
          {
            label: "The Recording Indicator",
            items: [
              "The red accent takes inspiration from the red recording indicator seen on cameras and video interfaces.",
              "Recording → Action → Motion → Production",
            ],
          },
          {
            label: "The Play Button",
            items: [
              "The triangular element represents the universal play symbol, immediately connecting the identity with video.",
              "Video → Playback → Motion → Content",
            ],
          },
        ],
        footnote:
          "These two elements were combined with a geometric, camera-inspired structure to create a distinctive EDIOS logomark — a symbol that feels connected to video without directly illustrating a conventional camera.",
        visual: {
          name: "4",
          alt: "EDIOS logomark — recording indicator and play button symbolism",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "construction",
        num: "04",
        kicker: "04 — LOGO CONSTRUCTION",
        headline: "Built On A Strong\n**Geometric Grid.**",
        lede: [
          "The logomark uses a strong geometric structure with sharp edges and controlled negative space.",
          "The outer form creates a visual reference to a camera body, while the central opening gives the mark its own distinctive character.",
          "The right-facing triangle acts as the visual focal point, creating a sense of movement and forward motion.",
          "The overall construction was intentionally kept bold so that the mark remains recognizable when reduced to an icon or used independently from the wordmark.",
        ],
        visual: {
          name: "3",
          alt: "EDIOS logo construction — geometric grid and structure",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "language",
        num: "05",
        kicker: "05 — VISUAL LANGUAGE",
        theme: "dark",
        headline: "A Dark, Cinematic Palette With\nA Single **Bold Signal.**",
        lede: ["The visual direction was developed around a dark cinematic aesthetic."],
        points: [
          {
            label: "Metallic Red",
            items: [
              "Used as the foundation of the identity, creating a cinematic and professional appearance.",
            ],
          },
          {
            label: "White",
            items: ["Provides contrast and ensures the identity remains clean and highly legible."],
          },
          {
            label: "Maraschino Red",
            items: [
              "Used as the primary accent, inspired by the recording indicator and the energy of production.",
            ],
          },
        ],
        footnote:
          "The restrained palette allows red to function as an intentional visual signal rather than becoming an overwhelming brand color.",
        visual: {
          name: "8",
          alt: "EDIOS visual language — metallic red, white, and maraschino red palette",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "typography",
        num: "06",
        kicker: "06 — TYPOGRAPHY",
        headline: "Futuristic Letterforms,\n**Engineered To Match.**",
        lede: [
          "The wordmark follows the same geometric language as the symbol.",
          "EDIOS is treated with a custom-styled, futuristic typographic approach featuring:",
        ],
        tags: [
          "Geometric letterforms",
          "Clean spacing",
          "Strong horizontal structure",
          "Sharp, technical details",
          "High legibility",
        ],
        footnote:
          "The typography was designed to complement the logomark rather than compete with it, creating a cohesive relationship between symbol and wordmark.",
        visual: {
          name: "6",
          alt: "EDIOS typography — custom-styled futuristic wordmark",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "system",
        num: "07",
        kicker: "07 — LOGO SYSTEM",
        headline: "A Flexible System,\nNot A **Single Logo.**",
        lede: ["The identity was designed as a flexible system rather than a single logo."],
        points: [
          {
            label: "Primary Logo",
            items: ["Logomark + EDIOS wordmark + descriptor — EDIOS Video Production Studio."],
          },
          {
            label: "Secondary Mark",
            items: ["The EDIOS logomark alone can function as an independent brand asset."],
          },
        ],
        tags: [
          "Social media profile images",
          "Camera equipment",
          "Clothing",
          "Watermarks",
          "Production gear",
          "Video intros/outros",
          "App icons",
          "Merchandise",
        ],
        footnote:
          "The secondary mark makes the identity suitable for moments where a full wordmark doesn't fit.",
        visual: {
          name: "7",
          alt: "EDIOS logo system — primary and secondary mark variations",
          width: 1920,
          height: 1080,
        },
      },
      {
        type: "editorial",
        id: "applications",
        num: "08",
        kicker: "08 — BRAND APPLICATIONS",
        headline: "Tested In Real\n**Production Environments.**",
        lede: [
          "To test the flexibility of the identity, the logo was explored across realistic production environments.",
        ],
        points: [
          {
            label: "Production Posters",
            items: ["Using the symbol as a graphic element within cinematic compositions."],
          },
          {
            label: "Monitor / Screen",
            items: [
              "Demonstrating how the identity can appear naturally within digital video environments.",
            ],
          },
          {
            label: "Merchandise",
            items: ["Testing the standalone logomark on apparel and production-related clothing."],
          },
          {
            label: "Microphone & Equipment",
            items: ["Exploring how the compact symbol can work on physical production equipment."],
          },
        ],
        footnote:
          "These applications helped validate the identity beyond a simple presentation board.",
        visuals: [
          { name: "9", alt: "EDIOS production poster application", width: 1920, height: 1080 },
          { name: "10", alt: "EDIOS monitor and screen application", width: 1920, height: 1080 },
          {
            name: "11",
            alt: "EDIOS merchandise and clothing application",
            width: 1080,
            height: 1080,
          },
          {
            name: "12",
            alt: "EDIOS microphone and equipment application",
            width: 1080,
            height: 1080,
          },
        ],
      },
      {
        type: "editorial",
        id: "direction",
        num: "09",
        kicker: "09 — DESIGN DIRECTION",
        headline: "Cinematic × Geometric ×\n**Edgy × Futuristic.**",
        lede: ["The final visual direction combines four key qualities."],
        tags: ["Cinematic", "Geometric", "Edgy", "Futuristic"],
        footnote:
          "Rather than using traditional filmmaking clichés, EDIOS uses a minimal geometric language to create a more contemporary production identity. The red accent provides energy, while black and white establish the cinematic foundation.",
      },
      {
        type: "editorial",
        id: "outcome",
        num: "10",
        kicker: "10 — THE OUTCOME",
        theme: "dark",
        headline: "A Mark That Travels\n**Beyond The Logo.**",
        lede: [
          "The final EDIOS identity establishes a visual presence that reflects the studio's core services while remaining flexible enough to grow with the business.",
          "The combination of the camera-inspired structure, play symbol, and recording-inspired red accent creates a mark that communicates video production in a simple and recognizable way.",
          "More importantly, the identity is designed to work beyond the logo itself — becoming a visual system that can be carried into films, equipment, social media, apparel, promotional material, and future brand experiences.",
        ],
      },
      {
        type: "ending",
        word: "EDIOS",
        tag: [
          { text: "Ideas. " },
          { text: "Frames. ", accent: true },
          { text: "Stories in Motion." },
        ],
        visual: {
          name: "1",
          alt: "EDIOS final brand statement artwork",
          width: 1920,
          height: 1080,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyDocument | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
