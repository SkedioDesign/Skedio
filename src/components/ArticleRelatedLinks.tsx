import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getServiceBySlug } from "@/data/services";
import { getProjectBySlug } from "@/data/projects";

interface ArticleRelatedLinksProps {
  // Explicitly `| undefined` rather than `?:` because the project enables
  // exactOptionalPropertyTypes and callers pass the raw data fields straight
  // through, which may legitimately be undefined.
  serviceSlug: string | undefined;
  projectSlug: string | undefined;
}

/**
 * Contextual links from an article out to the service it informs and the work
 * that demonstrates it.
 *
 * These are deliberately deep links rather than hub links: a footer link to
 * /services tells a crawler nothing about this post, whereas naming the one
 * service and one project that the post actually concerns is the editorial
 * signal. Every visible label is read from the data files, so the module
 * cannot assert a relationship the content has not declared — an undeclared
 * slug simply renders no card.
 */
export function ArticleRelatedLinks({ serviceSlug, projectSlug }: ArticleRelatedLinksProps) {
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const project = projectSlug ? getProjectBySlug(projectSlug) : undefined;

  if (!service && !project) return null;

  return (
    <section className="border-t border-border bg-surface/30 py-20">
      <div className="mx-auto max-w-[900px] px-6">
        <p className="eyebrow">Where this applies</p>
        <h2 className="type-h3 mt-2">From reading to building</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {service && (
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Service
              </p>
              <h3 className="mt-2 font-bold tracking-tight transition-colors group-hover:text-primary">
                {service.shortTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {service.tagline}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Explore the service <ArrowUpRight className="size-4" />
              </span>
            </Link>
          )}

          {project && (
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Project
              </p>
              <h3 className="mt-2 font-bold tracking-tight transition-colors group-hover:text-primary">
                {project.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {project.line}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                See the project <ArrowUpRight className="size-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
