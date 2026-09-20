import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { servicesData } from "@/data/services";

const svcImages: Record<string, string> = {
  "product-design": "/ProductDesign.png",
  "brand-identity": "/BrandIdentity.png",
  "ui-ux-design": "/VisualIdentity.png",
  "product-development": "/ProductDevelopment.png",
};

const accentColors: Record<string, string> = {
  "product-design": "#8537f4",
  "brand-identity": "#7c3aed",
  "ui-ux-design": "#f97316",
  "product-development": "#0d9488",
};

interface WhatWeDoItem {
  index: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  accentColor: string;
}

const services: WhatWeDoItem[] = servicesData
  .map((s, i) => ({
    index: String(i + 1).padStart(2, "0"),
    slug: s.slug,
    title: s.shortTitle,
    description: s.tagline,
    image: svcImages[s.slug],
    accentColor: accentColors[s.slug],
  }))
  .filter((s): s is WhatWeDoItem => Boolean(s.image && s.accentColor));

const DEFAULT_SERVICE: WhatWeDoItem = {
  index: "01",
  slug: "product-design",
  title: "Product Design",
  description: "Products that feel inevitable — shaped by strategy, research, and tested flows.",
  image: "/ProductDesign.png",
  accentColor: "#8537f4",
};

function AccentBar({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-300 ease-out",
        active
          ? "scale-y-100 opacity-100"
          : "scale-y-50 opacity-0 group-hover:scale-y-100 group-hover:opacity-40",
      )}
    />
  );
}

function DesktopAccordion({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-col pt-28">
      {services.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.slug}
            type="button"
            onMouseEnter={() => onSelect(i)}
            onClick={() => onSelect(i)}
            aria-pressed={isActive}
            className={cn(
              "group relative flex w-full cursor-pointer items-center gap-5 border-b py-7 pr-2 text-left transition-all duration-300 ease-out last:border-b-0",
              isActive ? "border-primary/30 lg:pl-5" : "border-border lg:pl-0 lg:hover:pl-3",
            )}
          >
            <AccentBar active={isActive} />
            <span
              aria-hidden="true"
              className={cn(
                "type-label shrink-0 transition-colors duration-300 ease-out",
                isActive
                  ? "font-extrabold text-primary"
                  : "text-muted-foreground group-hover:text-primary",
              )}
            >
              {s.index}
            </span>
            <span
              className={cn(
                "flex-1 font-display text-xl transition-colors duration-300 ease-out md:text-2xl",
                isActive
                  ? "font-extrabold text-foreground"
                  : "font-semibold text-muted-foreground/70 group-hover:text-foreground",
              )}
            >
              {s.title}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className={cn(
                "size-5 shrink-0 transition-all duration-300 ease-out",
                isActive
                  ? "-translate-y-0 translate-x-0 text-primary opacity-100"
                  : "-translate-y-1 translate-x-1 text-muted-foreground/50 opacity-0 group-hover:text-primary group-hover:opacity-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function MobileAccordion({
  active,
  onSelect,
}: {
  active: number | null;
  onSelect: (i: number | null) => void;
}) {
  return (
    <div className="space-y-4">
      {services.map((s, i) => {
        const isOpen = i === active;
        return (
          <div
            key={s.slug}
            className={cn(
              "overflow-hidden rounded-2xl border bg-card transition-colors duration-300 ease-out",
              isOpen ? "border-primary/50" : "border-border",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`service-panel-${s.slug}`}
              className="flex w-full cursor-pointer items-center gap-4 p-6 text-left"
            >
              <span
                className={cn(
                  "type-label shrink-0 transition-colors duration-300 ease-out",
                  isOpen ? "font-extrabold text-primary" : "text-muted-foreground",
                )}
              >
                {s.index}
              </span>
              <span
                className={cn(
                  "flex-1 font-display text-lg font-bold tracking-tight transition-colors duration-300 ease-out",
                  isOpen ? "text-foreground" : "text-foreground/70",
                )}
              >
                {s.title}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-5 shrink-0 transition-transform duration-300 ease-out",
                  isOpen ? "rotate-180 text-primary" : "text-muted-foreground",
                )}
              />
            </button>

            <div
              id={`service-panel-${s.slug}`}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${s.accentColor}45 0%, transparent 50%)`,
                      }}
                    />
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors duration-200 ease-out hover:text-primary-hover"
                  >
                    Explore {s.title}
                    <ArrowUpRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WhatWeDo() {
  const [active, setActive] = useState<number | null>(0);
  const item = services[active ?? 0] ?? DEFAULT_SERVICE;

  return (
    <section
      id="services"
      className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pt-20 pb-20 lg:pt-24 lg:pb-24"
    >
      <ScrollReveal>
        <p className="eyebrow">What we do</p>
        <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Services that drive brands forward
        </h2>
      </ScrollReveal>

      <div className="mt-14 hidden grid-cols-1 items-start gap-12 lg:grid lg:grid-cols-5 lg:gap-16">
        <ScrollReveal direction="left" className="lg:col-span-2">
          <DesktopAccordion active={active ?? 0} onSelect={setActive} />
        </ScrollReveal>
        <ScrollReveal direction="right" className="lg:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="relative aspect-[16/9] overflow-hidden">
              {services.map((s, i) => (
                <div
                  key={s.slug}
                  aria-hidden={i !== (active ?? 0)}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300 ease-out",
                    i === (active ?? 0) ? "opacity-100" : "opacity-0",
                  )}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${s.accentColor}59 0%, transparent 48%)`,
                    }}
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
            </div>

            <div className="p-5 md:p-6">
              <div key={item.index} className="sk-fade-up">
                <div className="flex items-center gap-3">
                  <span className="type-label font-extrabold text-primary">{item.index}</span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="type-caption text-muted-foreground">Our services</span>
                </div>
                <h3 className="mt-2.5 font-display text-xl font-extrabold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <Link
                to="/services/$slug"
                params={{ slug: item.slug }}
                className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors duration-200 ease-out hover:text-primary-hover"
              >
                Explore {item.title}
                <ArrowUpRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-10 lg:hidden">
        <MobileAccordion active={active} onSelect={setActive} />
      </div>
    </section>
  );
}
