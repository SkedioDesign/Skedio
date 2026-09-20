import { useEffect } from "react";
import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { seo } from "@/lib/seo";
import { captureClientError } from "@/lib/sentry-client";
import { SiteHeader } from "@/components/SiteHeader";
import { logError } from "@/lib/error-capture";

const errorMeta = seo({
  title: "Something went wrong — Skédio",
  description:
    "An unexpected error occurred while rendering this page. Try again or head back home.",
  noindex: true,
});

const robotsMeta = errorMeta.find(
  (m): m is { name: string; content: string } => "name" in m && m.name === "robots",
);

export function ErrorFallback({ error, info, reset }: ErrorComponentProps) {
  useEffect(() => {
    logError(error);
    if (info?.componentStack) {
      logError(info.componentStack);
    }
    captureClientError(error, {
      tag: "error-boundary",
      extra: { componentStack: info?.componentStack },
    });
  }, [error, info]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* React 19 hoists <meta> rendered here into <head> */}
      {robotsMeta && <meta name={robotsMeta.name} content={robotsMeta.content} />}

      {/* Nav */}
      <SiteHeader
        links={[
          { label: "Home", to: "/" },
          { label: "About", to: "/about" },
          { label: "Insights", to: "/insights" },
        ]}
      />

      {/* Error message */}
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 py-24 text-center md:py-36"
      >
        <p className="eyebrow">Something went wrong</p>
        <h1 className="type-h2 mt-5 max-w-2xl">We hit an unexpected hiccup</h1>
        <p className="type-body mt-5 max-w-md text-muted-foreground">
          An error occurred while rendering this page. Your data is safe — try again or head back
          home.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
          >
            Try Again
            <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:rotate-180">
              <RotateCcw className="size-4" />
            </span>
          </button>
          <Link
            to="/"
            className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-foreground transition-colors duration-250 ease-out hover:border-ink hover:bg-ink hover:text-ink-foreground"
          >
            Go Home
            <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
