import { Link } from "@tanstack/react-router";
import type { BreadcrumbItem } from "@/lib/schema";

export function Breadcrumbs({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`sk-breadcrumbs type-sm ${className}`.trim()}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1;
          const isExternal = /^https?:/.test(crumb.item);
          const path = crumb.item.replace(/#.*$/, "");
          const hasHash = crumb.item.includes("#");
          const key = crumb.item;

          if (isLast) {
            return (
              <li key={key} aria-current="page" className="flex items-center gap-x-2">
                <span className="font-medium text-foreground">{crumb.name}</span>
              </li>
            );
          }

          return (
            <li key={key} className="flex items-center gap-x-2">
              {hasHash || isExternal ? (
                <a
                  href={crumb.item}
                  className="sk-breadcrumbs__link text-muted-foreground transition-colors hover:text-primary"
                >
                  {crumb.name}
                </a>
              ) : (
                <Link
                  to={path}
                  className="sk-breadcrumbs__link text-muted-foreground transition-colors hover:text-primary"
                >
                  {crumb.name}
                </Link>
              )}
              <span aria-hidden="true" className="sk-breadcrumbs__sep text-muted-foreground/60">
                /
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
