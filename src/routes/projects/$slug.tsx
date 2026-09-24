import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { getProjectBySlug } from "@/data/projects";
import {
  getCaseStudy,
  type CaseStudyDocument,
  type CaseStudySection,
  type ImageRef,
} from "@/data/case-studies";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCreativeWorkSchema, getBreadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";
import { WebpImage } from "@/components/WebpImage";

import "./case-study.css";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project || !project.published) throw notFound();
    const caseStudy = getCaseStudy(params.slug);
    if (!caseStudy) throw notFound();
    return { project, slug: params.slug, caseStudy };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) {
      return {
        meta: seo({
          title: "Case Study Not Found | Skédio",
          description: "The requested project case study could not be found.",
          noindex: true,
        }),
      };
    }

    return {
      meta: seo({
        title: project.metaTitle,
        description: project.metaDescription,
        image: project.ogImage,
        url: `/projects/${project.slug}`,
        themeColor: project.themeColor,
        type: "article",
      }),
      links: canonicalLink(`/projects/${project.slug}`),
    };
  },
  component: CaseStudy,
  notFoundComponent: CaseStudyNotFound,
});

function CaseStudyNotFound() {
  return (
    <main
      id="main-content"
      className="cs"
      style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "40px" }}
    >
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <h1 className="cs-display" style={{ fontSize: "clamp(48px, 8vw, 80px)", marginBottom: 16 }}>
          Case Study Not Found
        </h1>
        <p className="cs-lede" style={{ margin: "0 auto 32px" }}>
          The requested project case study could not be located.
        </p>
        <Link
          to="/"
          className="cs-nav__link"
          style={{
            display: "inline-flex",
            padding: "12px 24px",
            background: "var(--cs-black)",
            color: "var(--cs-white)",
            borderRadius: 999,
          }}
        >
          <ArrowLeft size={16} /> RETURN TO PORTFOLIO
        </Link>
      </div>
    </main>
  );
}

/* ------------------------- Image & Text Primitives --------------------- */

function CsImage({
  image,
  assets,
  className,
  loading = "lazy",
  fetchPriority,
}: {
  image: ImageRef;
  assets: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const dims =
    image.width != null && image.height != null ? { width: image.width, height: image.height } : {};
  return (
    <WebpImage
      src={`${assets}/${image.name}.jpg`}
      alt={image.alt}
      {...dims}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  );
}

/**
 * Renders inline content markers:
 *   "**text**"  → .cs-accent span
 *   "##text##"  → dark-ink span
 *   "\n"        → <br />
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|##[^#]+##)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("##") && part.endsWith("##") && part.length > 4) {
          return (
            <span key={i} style={{ color: "#111111" }}>
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <span key={i} className="cs-accent">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <Rich text={line} />
        </Fragment>
      ))}
    </>
  );
}

/* ------------------------- Reusable Primitives ------------------------- */

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        el.classList.add("is-inview");
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => el.classList.add("is-inview"),
      });
    },
    { scope: ref, dependencies: [options] },
  );
  return ref;
}

function Reveal({
  children,
  delay,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h3" | "span" | "li" | "figure" | "header";
}) {
  const ref = useInView<HTMLElement>();
  return (
    <Tag ref={ref as never} data-delay={delay} className={`cs-reveal ${className}`}>
      {children}
    </Tag>
  );
}

function Section({
  children,
  className = "",
  id,
  dataChapter,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  dataChapter?: string;
}) {
  return (
    <section id={id} className={`cs-section ${className}`} data-chapter={dataChapter}>
      <div className="cs-section-inner">{children}</div>
    </section>
  );
}

function SectionHead({ kicker, children }: { kicker: string; children?: ReactNode }) {
  return (
    <div className="cs-sechead">
      <p className="cs-kicker">{kicker}</p>
      {children}
    </div>
  );
}

/* ============================ EDITORIAL SECTIONS ======================= */

function CoverSection({
  doc,
  section,
  crumbs,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "cover" }>;
  crumbs: BreadcrumbItem[];
}) {
  const artRef = useInView<HTMLDivElement>();

  return (
    <header className="cs-cover" id="top">
      <div className="cs-cover__title-wrap">
        <Breadcrumbs items={crumbs} className="cs-cover__crumbs" />
        <h1 className="cs-cover__word cs-display">
          {section.wordmark.map((w, i) => (
            <span key={i} className={`row ${w.accent ? "row--accent" : ""}`}>
              <Rich text={w.text} />
            </span>
          ))}
        </h1>
      </div>

      <div className="cs-cover__meta-grid">
        <div className="cs-cover__facts">
          {section.facts.map((f) => (
            <div key={f.label} className="cs-cover__fact-item">
              <span className="cs-cover__fact-label">{f.label}</span>
              <span className="cs-cover__fact-val">{f.value}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="cs-cover__sub">
            {section.subtitle.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <div className="cs-cover__scroll-row">
            <a href="#overview" className="cs-cover__scroll">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>

      <figure className="cs-cover__art" ref={artRef as never}>
        <div className="cs-cover__art-inner">
          <CsImage
            image={section.coverImage}
            assets={doc.assets}

            loading="eager"
            fetchPriority="high"
          />
        </div>
      </figure>
    </header>
  );
}

function TagMarquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={`cs-editorial__tags-track ${paused ? "is-paused" : ""}`}
      onClick={() => setPaused((v) => !v)}
      role="button"
      aria-label="Toggle tag marquee animation"
    >
      {[...items, ...items].map((tag, i) => (
        <span key={`${tag}-${i}`} className="cs-editorial__tag" aria-hidden={i >= items.length}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function ChapterNav({ chapters }: { chapters: CaseStudyDocument["chapters"] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? chapters : chapters.slice(0, 3);
  const hiddenCount = chapters.length - 3;

  const goTo = (id: string) => {
    setExpanded(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`cs-chapter-nav ${expanded ? "cs-chapter-nav--open" : ""}`}>
      <ol className="cs-chapter-nav__list">
        {visible.map((c) => (
          <li key={c.num}>
            <button type="button" className="cs-chapter-nav__item" onClick={() => goTo(c.id)}>
              <span className="cs-chapter-nav__num">{c.num}</span>
              <span className="cs-chapter-nav__label">{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
      {hiddenCount > 0 && (
        <button
          type="button"
          className="cs-chapter-nav__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span>{expanded ? "Close" : `+${hiddenCount} More`}</span>
          <ChevronDown size={14} />
        </button>
      )}
    </nav>
  );
}

function OverviewSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "overview" }>;
}) {
  return (
    <Section className="cs-overview" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker}>
        <ol className="cs-overview__index">
          {section.index.map((it) => (
            <li key={it.num}>
              <span>{it.num}</span>
              {it.label}
            </li>
          ))}
        </ol>
      </SectionHead>

      <div className="cs-overview__head">
        <Reveal as="h2" className="cs-overview__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <Reveal className="cs-overview__visual" delay={2}>
        <CsImage image={section.visual} assets={doc.assets} />
      </Reveal>
    </Section>
  );
}

function ChallengesSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "challenge" }>;
}) {
  return (
    <Section className="cs-challenge" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-challenge__row">
        <Reveal as="h2" className="cs-challenge__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede cs-lede--muted" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <div className="cs-problem-words">
        {section.problemWords.map((w, i) => (
          <Reveal key={i} className="cs-problem-word" delay={i}>
            {w.base}
            <strong>{w.strong}</strong>
          </Reveal>
        ))}
      </div>

      <div className="cs-bid-stage">
        {section.phoneCards.map((card, i) => (
          <Reveal
            key={i}
            className={`cs-phone-card ${card.offset ? `cs-phone-card--offset-${card.offset}` : ""}`}
            delay={i % 3}
          >
            <CsImage image={card.image} assets={doc.assets} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProcessSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "process" }>;
}) {
  return (
    <Section className="cs-process" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-process__grid">
        <Reveal as="h2" className="cs-process__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <div className="cs-timeline">
        {section.steps.map((step, idx) => (
          <Reveal key={step.num} className="cs-timeline__row" delay={(idx % 3) as 1 | 2 | 3}>
            <span className="cs-timeline__num">{step.num}</span>
            <h3 className="cs-timeline__title">{step.title}</h3>
            <p className="cs-timeline__desc">{step.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="cs-process__visual" delay={2}>
        <CsImage image={section.visual} assets={doc.assets} />
      </Reveal>
    </Section>
  );
}

function PersonasSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "personas" }>;
}) {
  return (
    <Section className="cs-personas" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />

      <div className="cs-personas__head">
        <Reveal as="h2" className="cs-personas__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      {section.personas.map((persona) => (
        <section key={persona.title} className={`cs-persona cs-persona--${persona.variant}`}>
          <div className="cs-persona__header">
            {persona.variant === "rider" ? (
              <>
                <span className="cs-persona__name cs-display">{persona.title}</span>
                <span className="cs-persona__role">{persona.role}</span>
              </>
            ) : (
              <>
                <span className="cs-persona__role">{persona.role}</span>
                <span className="cs-persona__name cs-display">{persona.title}</span>
              </>
            )}
          </div>
          <div className="cs-persona__grid">
            <div className="cs-persona__points">
              {persona.pills.map((pill) => (
                <span key={pill} className="cs-persona__pill">
                  {pill}
                </span>
              ))}
            </div>
            <div className="cs-persona__stage">
              {persona.phones.map((phone, i) => (
                <Reveal key={i} className="cs-persona__phone-frame" delay={i}>
                  <CsImage image={phone} assets={doc.assets} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </Section>
  );
}

function FinalSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "final" }>;
}) {
  return (
    <Section className="cs-final" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-final__col">
        <Reveal as="h2" className="cs-final__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede cs-final__lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <Reveal className="cs-final__showcase" delay={2}>
        <CsImage image={section.showcase} assets={doc.assets} />
      </Reveal>

      <div className="cs-journey">
        <h3 className="cs-kicker cs-kicker--solid">{section.journeyKicker}</h3>
        <div className="cs-journey__rows">
          {section.journey.map((step, idx) => (
            <Reveal key={step.num} className="cs-journey__row" delay={(idx % 3) as 1 | 2 | 3}>
              <span className="cs-journey__num">{step.num}</span>
              <h4 className="cs-journey__title">{step.title}</h4>
              <p className="cs-journey__desc">{step.desc}</p>
              <span className="cs-journey__arrow">
                <ArrowDownRight size={20} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function EditorialSectionRenderer({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "editorial" }>;
}) {
  const theme = section.theme ?? "light";
  return (
    <Section
      className={`cs-editorial cs-editorial--${theme}`}
      id={section.id}
      dataChapter={section.num}
    >
      <SectionHead kicker={section.kicker} />
      <div className="cs-editorial__layout">
        {section.headline && (
          <Reveal as="h2" className="cs-editorial__headline cs-display">
            <RichText text={section.headline} />
          </Reveal>
        )}
        <div className="cs-editorial__body">
          {section.lede?.map((p, i) => (
            <Reveal key={i} as="p" className="cs-lede" delay={(i % 3) as 1 | 2 | 3}>
              <RichText text={p} />
            </Reveal>
          ))}

          {(() => {
            const tags = section.tags;
            if (!tags || tags.length === 0) return null;
            return (
              <Reveal className="cs-editorial__tags" delay={(section.lede?.length ?? 1) % 3}>
                <TagMarquee items={tags} />
              </Reveal>
            );
          })()}

          {section.points && section.points.length > 0 && (
            <Reveal className="cs-editorial__points">
              {section.points.map((point, i) => (
                <article key={i} className="cs-editorial__point">
                  {point.label && <h3 className="cs-editorial__point-label">{point.label}</h3>}
                  <ul className="cs-editorial__point-items">
                    {point.items?.map((item, j) => (
                      <li key={j} className="cs-editorial__point-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </Reveal>
          )}

          {section.footnote && (
            <Reveal as="p" className="cs-lede cs-editorial__footnote">
              {section.footnote}
            </Reveal>
          )}
        </div>
      </div>

      {section.visual && (
        <Reveal className="cs-editorial__visual" delay={2}>
          <CsImage image={section.visual} assets={doc.assets} />
        </Reveal>
      )}

      {section.visuals && section.visuals.length > 0 && (
        <div className="cs-editorial__visuals">
          {section.visuals.map((v, i) => (
            <Reveal key={i} className="cs-editorial__visual" delay={i % 3}>
              <CsImage image={v} assets={doc.assets} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

function EndingSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "ending" }>;
}) {
  return (
    <footer className="cs-end">
      <div className="cs-end__inner">
        <h2 className="cs-end__word cs-display">{section.word}</h2>
        <div className="cs-end__tag cs-display">
          {section.tag.map((t, i) => (
            <span key={i} className={t.accent ? "cs-accent" : ""}>
              {t.text}
            </span>
          ))}
        </div>
        <Reveal className="cs-end__visual">
          <CsImage image={section.visual} assets={doc.assets} />
        </Reveal>
        <p className="cs-end__foot">{section.foot}</p>
      </div>
    </footer>
  );
}

/* ============================ MAIN ROUTE PAGE ========================== */

function SectionRenderer({ doc, section }: { doc: CaseStudyDocument; section: CaseStudySection }) {
  switch (section.type) {
    case "overview":
      return <OverviewSection doc={doc} section={section} />;
    case "challenge":
      return <ChallengesSection doc={doc} section={section} />;
    case "process":
      return <ProcessSection doc={doc} section={section} />;
    case "personas":
      return <PersonasSection doc={doc} section={section} />;
    case "final":
      return <FinalSection doc={doc} section={section} />;
    case "editorial":
      return <EditorialSectionRenderer doc={doc} section={section} />;
    default:
      return null;
  }
}

function CaseStudy() {
  const { project, slug, caseStudy } = Route.useLoaderData();
  const doc = caseStudy;

  const [activeChapter, setActiveChapter] = useState("01");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        const last = visible[visible.length - 1];
        if (last) {
          const chapter = last.target.getAttribute("data-chapter");
          if (chapter) setActiveChapter(chapter);
        }
      },
      { rootMargin: "-35% 0px -40% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const creativeWorkSchema = getCreativeWorkSchema({
    name: project.name,
    headline: project.line,
    description: project.metaDescription,
    image: project.ogImage,
    url: `/projects/${project.slug}`,
    datePublished: project.publishedDate,
    client: project.client,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", item: "/" },
    { name: "Projects", item: "/#work" },
    { name: project.name, item: `/projects/${project.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const coverSection = doc.sections.find(
    (s): s is Extract<CaseStudySection, { type: "cover" }> => s.type === "cover",
  );
  const endingSection = doc.sections.find(
    (s): s is Extract<CaseStudySection, { type: "ending" }> => s.type === "ending",
  );
  const bodySections = doc.sections.filter(
    (s): s is Exclude<CaseStudySection, { type: "cover" } | { type: "ending" }> =>
      s.type !== "cover" && s.type !== "ending",
  );

  return (
    <main
      id="main-content"
      className="cs"
      style={
        {
          "--cs-accent": project.themeColor,
          "--cs-accent-hover": `color-mix(in srgb, ${project.themeColor} 82%, #000000)`,
          "--cs-accent-subtle": `color-mix(in srgb, ${project.themeColor} 11%, #ffffff)`,
        } as CSSProperties
      }
    >
      <StructuredData data={[creativeWorkSchema, breadcrumbSchema]} />
      {/* Minimal Sticky Navigation */}
      <nav
        className={`cs-nav ${isScrolled ? "cs-nav--scrolled" : ""}`}
        aria-label="Case study navigation"
      >
        <Link to="/" className="cs-nav__brand">
          {doc.brand}
        </Link>
        <div className="cs-nav__chapters" aria-label="Chapter progress">
          {doc.chapters.map((c) => (
            <button
              key={c.num}
              type="button"
              onClick={() => scrollToSection(c.id)}
              className={`cs-nav__chapter-btn ${activeChapter === c.num ? "is-active" : ""}`}
              aria-label={`Go to section ${c.num} ${c.label}`}
            >
              {c.num}
            </button>
          ))}
        </div>
        <Link to="/" className="cs-nav__link" aria-label="Return to portfolio">
          <ArrowLeft size={14} /> CASE STUDY
        </Link>
      </nav>

      {/* Case Study Editorial Sections */}
      {coverSection && <CoverSection doc={doc} section={coverSection} crumbs={breadcrumbItems} />}
      <ChapterNav chapters={doc.chapters} />
      {bodySections.map((section) => (
        <SectionRenderer key={`${section.type}-${section.id}`} doc={doc} section={section} />
      ))}
      {endingSection && <EndingSection doc={doc} section={endingSection} />}
    </main>
  );
}
