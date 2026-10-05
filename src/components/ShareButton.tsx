import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Share control for an article.
 *
 * Prefers the platform share sheet via `navigator.share` — on a phone that is
 * the thing people actually want, since it offers WhatsApp and Messages
 * alongside the usual targets, and it needs no third-party script. Where it is
 * unavailable (desktop browsers, Firefox) the button copies the canonical URL
 * instead, which is the one fallback that works everywhere and needs no server.
 *
 * `navigator.share` must be called from a user gesture, so the capability check
 * happens on click rather than on mount — and mounting is SSR, where
 * `navigator` does not exist.
 */
export function ShareButton({
  url,
  title,
  className = "",
}: {
  /** Absolute canonical URL. Built by the caller from the post slug so the
   *  shared link is the same URL the page claims as canonical. */
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    // Clears the confirmation. Held by a timer so a second click restarts the
    // window rather than racing it.
    const t = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  const onClick = async () => {
    // A share sheet the user dismisses rejects with AbortError. That is a
    // normal outcome, not a failure, so it must not fall through to copying.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard needs a secure context and permission; if either is missing
      // there is nothing left to try, so the button just does nothing rather
      // than claiming a copy that never happened.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      /* The label is what changes on copy, and it is read as the button's own
         name rather than as a live region — `aria-live` on the button would
         announce the label change twice for anyone navigating by name. */
      aria-label={copied ? "Link copied to clipboard" : `Share “${title}”`}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors duration-200 hover:border-primary/50 hover:text-primary",
        copied && "border-primary/50 text-primary",
        className,
      )}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Share2 className="size-4" aria-hidden="true" />
      )}
      {/* Label collapses to the icon below `sm`, where the byline is tight
          enough that the words cost a line. `aria-label` above is unaffected,
          so the button keeps its full accessible name at every width — the
          visible label is decoration, not the accessible name. */}
      <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
