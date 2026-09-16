import { useLayoutEffect, useRef, useState } from "react";
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

type WorkFilter = ProjectCategory | "all";

const filters: Array<{ label: string; value: WorkFilter }> = [
  { label: "All", value: "all" },
  { label: "UI/UX", value: "UI/UX" },
  { label: "Branding", value: "Branding" },
  { label: "Social Media", value: "Social Media" },
];

const filterDotColors: Record<WorkFilter, string> = {
  all: "bg-foreground/60",
  "UI/UX": "bg-primary",
  Branding: "bg-[#f97316]",
  "Social Media": "bg-[#0d9488]",
};

const tagColors: Record<ProjectTagColor, string> = {
  purple: "bg-primary",
  orange: "bg-[#f97316]",
  teal: "bg-[#0d9488]",
};

const sizeClasses: Record<ProjectCellSize, string> = {
  hero: "aspect-[3/4] md:col-span-2 md:row-span-2 md:aspect-auto",
  wide: "aspect-[16/9] md:col-span-2 md:aspect-auto",
  normal: "aspect-[4/3] md:aspect-auto",
};

const showsButton: Record<ProjectCellSize, boolean> = {
  hero: true,
  wide: true,
  normal: false,
};

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
        <img
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-200 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />

        <span
          className={`absolute left-5 top-5 inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white md:left-7 md:top-7 ${tagColors[project.tagColor]}`}
        >
          {project.category}
        </span>

        <div
          className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 ${
            isBillboard ? "p-8 md:p-12" : "p-5 md:p-7"
          }`}
        >
          <div className="min-w-0">
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

          {(isBillboard || showsButton[project.size]) && (
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-200 ease-out group-hover:bg-primary-hover">
              View Project
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          )}
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

    linkRefs.current.forEach((el, slug) => {
      const first = prev.get(slug);
      if (!el || !first) return;
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / last.width;
      const sy = first.height / last.height;

      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      void el.offsetWidth;
      el.style.transition = `transform ${MORPH_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      el.style.transform = "";
      el.addEventListener(
        "transitionend",
        () => {
          el.style.transition = "";
          el.style.transformOrigin = "";
        },
        { once: true },
      );
    });
  }, [filter]);

  return (
    <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-28">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Recent projects
            </h2>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
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
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground/70 hover:border-primary/50 hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 rounded-full transition-colors duration-200",
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
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:auto-rows-[15rem] md:grid-flow-dense lg:grid-cols-4 lg:auto-rows-[17rem]">
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

        {ghosts.map((g) => (
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
            <img
              src={g.project.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          </span>
        ))}
      </div>
    </section>
  );
}
