import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useContactModal } from "@/context/use-contact-modal";
import { useTheme } from "@/context/use-theme";
import { cn } from "@/lib/utils";

export type HeaderLink =
  { label: string; to: string; hash?: string; current?: false } | { label: string; current: true };

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={cn("h-9 w-auto md:h-12", className)}
    />
  );
}

export function SiteHeader({ links }: { links: HeaderLink[] }) {
  const { openContactModal } = useContactModal();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer theme-dependent UI until after hydration to avoid a
    // server/client (system preference) markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (mq.matches) setMenuOpen(false);
    };

    if (menuOpen) window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onViewportChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onViewportChange);
    };
  }, [menuOpen]);

  const handleCta = () => {
    setMenuOpen(false);
    openContactModal();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <Link to="/" aria-label="Skédio home">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-6 md:gap-10">
            <ul className="type-label hidden items-center gap-10 uppercase md:flex">
              {links.map((link) =>
                link.current ? (
                  <li key={link.label}>
                    <span className="type-body tracking-[0.08em] text-primary">{link.label}</span>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      {...(link.hash ? { hash: link.hash } : {})}
                      className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="hidden size-10 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-alt md:grid"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )
              ) : (
                <span className="size-5" />
              )}
            </button>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={openContactModal}
                className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
              >
                Let's Talk
                <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-menu"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-alt md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-background transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          menuOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">
          <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Skédio home">
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-alt"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 pb-10 pt-10">
          {links.map((link) =>
            link.current ? (
              <span
                key={link.label}
                className="border-b border-border/60 py-6 text-lg font-semibold text-primary sm:text-xl"
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                {...(link.hash ? { hash: link.hash } : {})}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-border/60 py-6 text-lg font-semibold text-foreground transition-colors hover:text-primary sm:text-xl"
              >
                {link.label}
                <ArrowUpRight className="size-5 text-foreground/40 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            ),
          )}

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-4 text-base font-semibold text-foreground transition-colors hover:bg-surface-alt"
            >
              {mounted ? (
                <>
                  {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </>
              ) : (
                <span className="size-5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleCta}
              className="group type-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
            >
              Let's Talk
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
