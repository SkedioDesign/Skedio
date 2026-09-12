import { useEffect } from "react";
import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { seo } from "@/lib/seo";
import { useContactModal } from "@/context/contact-modal-context";
import { captureClientError } from "@/lib/sentry-client";

import "@/lib/error-capture";

const errorMeta = seo({
  title: "Something went wrong — Skédio",
  description:
    "An unexpected error occurred while rendering this page. Try again or head back home.",
  noindex: true,
});

const robotsMeta = errorMeta.find(
  (m): m is { name: string; content: string } => "name" in m && m.name === "robots",
);

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={`h-12 w-auto ${className}`}
    />
  );
}

export function ErrorFallback({ error, info, reset }: ErrorComponentProps) {
  const { openContactModal } = useContactModal();

  useEffect(() => {
    console.error(error);
    if (info?.componentStack) {
      console.error(info.componentStack);
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
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <Link to="/">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-10">
            <ul className="type-label hidden items-center gap-10 uppercase md:flex">
              <li>
                <Link
                  to="/"
                  className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/insights"
                  className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                >
                  Insights
                </Link>
              </li>
            </ul>
            <button
              type="button"
              onClick={openContactModal}
              className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
            >
              Let's Talk
            </button>
          </div>
        </nav>
      </header>

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
