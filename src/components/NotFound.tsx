import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { seo } from "@/lib/seo";
import { useContactModal } from "@/context/contact-modal-context";

const notFoundMeta = seo({
  title: "Page Not Found — Skédio",
  description:
    "The page you're looking for doesn't exist or has moved. Head back home or explore our work.",
  noindex: true,
});

const robotsMeta = notFoundMeta.find(
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

function PillLink({
  to,
  hash,
  variant = "solid",
  children,
}: {
  to: string;
  hash?: string;
  variant?: "solid" | "ink" | "outline";
  children: ReactNode;
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-transparent text-foreground hover:border-ink hover:bg-ink hover:text-ink-foreground"
      : variant === "ink"
        ? "bg-ink text-ink-foreground hover:bg-primary"
        : "bg-primary text-primary-foreground hover:bg-primary-hover";

  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      className={`group type-button inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 transition-colors duration-250 ease-out ${styles}`}
    >
      {children}
      <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}

export function NotFound() {
  const { openContactModal } = useContactModal();

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

      {/* 404 message */}
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 py-24 text-center md:py-36"
      >
        <p className="eyebrow">404 — Page Not Found</p>
        <h1 className="type-h2 mt-5 max-w-2xl">This page has lost its way</h1>
        <p className="type-body mt-5 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PillLink to="/">Back to Home</PillLink>
          <PillLink to="/" hash="work" variant="ink">
            Explore Our Work
          </PillLink>
          <PillLink to="/insights" variant="outline">
            Read Insights
          </PillLink>
        </div>
      </main>
    </div>
  );
}