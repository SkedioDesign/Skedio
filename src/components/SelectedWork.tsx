import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import {
  selectedWork,
  type ProjectCategory,
  type ProjectCellSize,
  type ProjectTagColor,
  type SelectedWorkItem,
} from "@/data/projects";
import { WebpImage } from "@/components/WebpImage";

type WorkFilter = ProjectCategory | "all";

const filters: Array<{ label: string; value: WorkFilter }> = [
  { label: "All", value: "all" },
  { label: "UI/UX", value: "UI/UX" },
  { label: "Branding", value: "Branding" },
  { label: "Social Media", value: "Social Media" },
  { label: "Development", value: "Development" },
];

const filterDotColors: Record<WorkFilter, string> = {
  all: "bg-foreground/60",
  "UI/UX": "bg-primary",
  Branding: "bg-[#f97316]",
  "Social Media": "bg-[#0d9488]",
  Development: "bg-[#2563eb]",
};

const tagColors: Record<ProjectTagColor, string> = {
  purple: "bg-primary",
  orange: "bg-[#f97316]",
  teal: "bg-[#0d9488]",
};

const sizeClasses: Record<ProjectCellSize, string> = {
  hero: "col-span-2 aspect-[16/9] sm:aspect-[21/9] md:col-span-2 md:row-span-2 md:aspect-auto",
  wide: "col-span-2 aspect-[16/9] sm:aspect-[21/9] md:col-span-2 md:aspect-auto",
  normal: "aspect-[4/3] md:aspect-auto",
};

const isCompactSize = (size: ProjectCellSize) => size === "normal";

/**
 * Responsive candidates per bento image. Widths track each card's real CSS
 * width so the browser never downloads the full-size original on mobile:
 *
 * - HaoCabs cover (hero cell, portrait 941px source, object-cover): 480w for
 *   mobile, 720w for desktop 1x (~566px CSS), full 941w twin for 2x DPR.
 *   The source aspect differs from the container — the crop stays
 *   object-cover; only the delivered resolution changes.
 * - Tiffinly (wide cell, 1600px source, object-cover): 480w mobile, 800w
 *   desktop 1x (~566px CSS), 1200w for 2x DPR. Both WebP and JPEG fallback
 *   candidates are provided.
 * - EDIOS (normal cell, 1920px source): 480w covers desktop 1x (~285px CSS
 *   at 2x DPR the browser picks 800w); full twin remains for larger DPR.
 */
const WIDE_SIZES = "(max-width: 768px) 100vw, 566px";
const COMPACT_SIZES = "(max-width: 768px) 50vw, 285px";

interface ResponsiveCandidates {
  src: string;
  srcSet?: string;
  webpSrcSet: string;
  sizes: string;
}

const responsiveByImage: Record<string, ResponsiveCandidates> = {
  "/HaoCabs/cover.png": {
    src: "/HaoCabs/cover.png",
    webpSrcSet:
      "/HaoCabs/cover-480.webp 480w, /HaoCabs/cover-720.webp 720w, /HaoCabs/cover.webp 941w",
    sizes: WIDE_SIZES,
  },
  "/tiffinly/1.jpg": {
    src: "/tiffinly/1-800.jpg",
    srcSet: "/tiffinly/1-480.jpg 480w, /tiffinly/1-800.jpg 800w, /tiffinly/1-1200.jpg 1200w",
    webpSrcSet: "/tiffinly/1-480.webp 480w, /tiffinly/1-800.webp 800w, /tiffinly/1-1200.webp 1200w",
    sizes: WIDE_SIZES,
  },
  "/EDIOS/1.jpg": {
    src: "/EDIOS/1-800.jpg",
    srcSet: "/EDIOS/1-480.jpg 480w, /EDIOS/1-800.jpg 800w, /EDIOS/1.webp 1920w",
    webpSrcSet: "/EDIOS/1-480.webp 480w, /EDIOS/1-800.webp 800w, /EDIOS/1.webp 1920w",
    sizes: COMPACT_SIZES,
  },
};

function responsiveFor(image: string, fallbackSizes: string): ResponsiveCandidates {
  return (
    responsiveByImage[image] ?? {
      src: image,
      webpSrcSet: "",
      sizes: fallbackSizes,
    }
  );
}

const MORPH_MS = 480;
const EXIT_MS = 340;

type RegisterRef = (slug: string, el: HTMLAnchorElement | null) => void;

function ProjectCard({
  project,
  index,
  layout,
  registerRef,
}: {
  project: SelectedWorkItem;
  index: number;
  layout: "bento" | "billboard";
  registerRef?: RegisterRef;
}) {
  const isBillboard = layout === "billboard";
  const isCompact = !isBillboard && isCompactSize(project.size);
  const bottomClasses = isCompact
    ? "justify-end p-4 md:justify-between md:p-7"
    : isBillboard
      ? "justify-between p-8 md:p-12"
      : "justify-between p-5 md:p-7";
  const responsive = responsiveFor(project.image, isCompact ? COMPACT_SIZES : WIDE_SIZES);
  const hasResponsive = responsive.webpSrcSet.length > 0;
  return (
    <ScrollReveal
      key={project.slug}
      delay={index % 3}
      className={isBillboard ? "aspect-[16/9] sm:aspect-[21/9]" : sizeClasses[project.size]}
    >
      <Link
        ref={(el) => registerRef?.(project.slug, el)}
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="group relative block h-full w-full overflow-hidden rounded-2xl bg-ink shadow-xl transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-2xl"
      >
        <WebpImage
          src={responsive.src}
          srcSet={responsive.srcSet}
          webpSrcSet={hasResponsive ? responsive.webpSrcSet : undefined}
          sizes={hasResponsive ? responsive.sizes : undefined}
          alt={`${project.title} — ${project.subtitle}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-200 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />

        <span
          className={`absolute left-5 top-5 inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white md:left-7 md:top-7 ${tagColors[project.tagColor]}`}
        >
          {project.category}
        </span>

        <div className={`absolute inset-x-0 bottom-0 flex items-end gap-4 ${bottomClasses}`}>
          <div className={cn("min-w-0", isCompact && "hidden md:block")}>
            <h3
              className={`font-display font-extrabold leading-none text-white ${
                isBillboard ? "text-2xl sm:text-4xl" : "text-xl md:text-2xl"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`mt-1.5 line-clamp-1 text-white/80 ${
                isBillboard ? "text-base sm:text-lg" : "text-sm"
              }`}
            >
              {project.subtitle}
            </p>
          </div>

          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white opacity-0 transition duration-200 ease-out group-hover:bg-primary-hover group-hover:opacity-100 md:inline-flex">
            View Project
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>

          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-200 ease-out group-hover:bg-primary-hover md:hidden"
          >
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}

interface Ghost {
  project: SelectedWorkItem;
  left: number;
  top: number;
  width: number;
  height: number;
}

export function SelectedWork() {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [ghosts, setGhosts] = useState<Ghost[]>([]);

  const outerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement | null>());
  const prevRects = useRef(new Map<string, DOMRect>());
  const ghostTimer = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  // Clear any pending ghost-exit timer on unmount so we never set state
  // on an unmounted component after a rapid filter change + navigation.
  useEffect(() => {
    return () => {
      if (ghostTimer.current) window.clearTimeout(ghostTimer.current);
    };
  }, []);

  const visible =
    filter === "all" ? selectedWork : selectedWork.filter((p) => p.category === filter);

  const registerRef: RegisterRef = (slug, el) => {
    linkRefs.current.set(slug, el);
  };

  const handleFilter = (next: WorkFilter) => {
    if (next === filter) return;

    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ghostTimer.current) window.clearTimeout(ghostTimer.current);

    const nextList =
      next === "all" ? selectedWork : selectedWork.filter((p) => p.category === next);
    const nextSlugs = new Set(nextList.map((p) => p.slug));

    const rects = new Map<string, DOMRect>();
    linkRefs.current.forEach((el, slug) => {
      if (el) rects.set(slug, el.getBoundingClientRect());
    });

    const exiting = visible.filter((p) => !nextSlugs.has(p.slug));
    if (!reducedMotion.current && exiting.length > 0) {
      const gridRect = outerRef.current?.getBoundingClientRect();
      if (gridRect) {
        setGhosts(
          exiting.map((p) => {
            const r = rects.get(p.slug);
            return {
              project: p,
              left: r ? r.left - gridRect.left : 0,
              top: r ? r.top - gridRect.top : 0,
              width: r?.width ?? 0,
              height: r?.height ?? 0,
            };
          }),
        );
        ghostTimer.current = window.setTimeout(() => setGhosts([]), EXIT_MS + 80);
      }
    }

    prevRects.current = rects;
    setFilter(next);
  };

  useLayoutEffect(() => {
    const prev = prevRects.current;
    prevRects.current = new Map();
    if (prev.size === 0 || reducedMotion.current) return;

    // READ phase: batch all getBoundingClientRect() calls before any writes.
    // No style mutations happen between these reads, so the browser can
    // satisfy them from a single layout pass.
    const pending: Array<{
      el: HTMLAnchorElement;
      dx: number;
      dy: number;
      sx: number;
      sy: number;
    }> = [];
    linkRefs.current.forEach((el, slug) => {
      const first = prev.get(slug);
      if (!el || !first) return;
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = last.width > 0 ? first.width / last.width : 1;
      const sy = last.height > 0 ? first.height / last.height : 1;
      // Skip no-op moves so we don't force style recalc for static cards.
      if (
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(sx - 1) < 0.002 &&
        Math.abs(sy - 1) < 0.002
      ) {
        return;
      }
      pending.push({ el, dx, dy, sx, sy });
    });
    if (pending.length === 0) return;

    // WRITE phase 1: apply the inverted FLIP state to every moving card.
    for (const { el, dx, dy, sx, sy } of pending) {
      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }
    // SINGLE forced reflow to flush the inverted state for all cards at once.
    // Previously this was `void el.offsetWidth` inside the loop (N reflows).
    void outerRef.current?.offsetWidth;

    // WRITE phase 2: release all cards to their natural position together.
    const cleanups: Array<() => void> = [];
    for (const { el } of pending) {
      el.style.transition = `transform ${MORPH_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      el.style.transform = "";
      const onEnd = () => {
        el.style.transition = "";
        el.style.transformOrigin = "";
      };
      el.addEventListener("transitionend", onEnd, { once: true });
      cleanups.push(() => el.removeEventListener("transitionend", onEnd));
    }
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [filter]);

  return (
    <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-20 lg:pb-24">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Recent projects
            </h2>
          </div>

          <div
            className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter projects by category"
          >
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground/70 hover:border-primary/50 hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-200 sm:size-2",
                    filter === f.value ? "bg-white" : filterDotColors[f.value],
                  )}
                />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div ref={outerRef} className="relative mt-12">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center text-muted-foreground">
            No {filter === "all" ? "projects" : `${filter} projects`} yet — check back soon.
          </div>
        ) : visible.length === 1 ? (
          <ProjectCard
            project={visible[0] as SelectedWorkItem}
            index={0}
            layout="billboard"
            registerRef={registerRef}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:auto-rows-[15rem] md:grid-flow-dense lg:grid-cols-4 lg:auto-rows-[17rem]">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                layout="bento"
                registerRef={registerRef}
              />
            ))}
          </div>
        )}

        {ghosts.map((g) => {
          const r = responsiveFor(g.project.image, WIDE_SIZES);
          const hasR = r.webpSrcSet.length > 0;
          return (
            <span
              key={g.project.slug}
              aria-hidden="true"
              className="pointer-events-none absolute overflow-hidden rounded-2xl bg-ink shadow-xl motion-reduce:hidden animate-out fade-out-0 zoom-out-95 fill-mode-forwards"
              style={{
                left: g.left,
                top: g.top,
                width: g.width,
                height: g.height,
                ["--tw-animation-duration" as string]: `${EXIT_MS}ms`,
              }}
            >
              <WebpImage
                src={r.src}
                srcSet={r.srcSet}
                webpSrcSet={hasR ? r.webpSrcSet : undefined}
                sizes={hasR ? r.sizes : undefined}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            </span>
          );
        })}
      </div>
    </section>
  );
}
