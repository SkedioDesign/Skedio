import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";

import { COOKIE_SETTINGS_EVENT, initAnalytics, readConsent, writeConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const choice = readConsent();
    if (choice === "accepted") {
      initAnalytics();
    } else if (choice === null) {
      setVisible(true);
    }

    const onOpenSettings = () => setVisible(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  if (!mounted || !visible) return null;

  const handleAccept = () => {
    writeConsent("accepted");
    initAnalytics();
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9998] p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-[900px] flex-col gap-5 rounded-2xl border border-border/80 bg-surface p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3 space-y-0">
          <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Cookie className="size-4" />
          </div>
          <div className="space-y-1.5">
            <p className="eyebrow">Cookies</p>
            <p className="type-body text-sm text-foreground/85">
              We use necessary cookies for site functionality. With your consent, we'd also like to
              use optional analytics cookies to understand how the site is used.{" "}
              <Link to="/privacy" className="text-primary font-medium underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-105 active:scale-95 cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
