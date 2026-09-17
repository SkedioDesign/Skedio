import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { HelpCircle } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * GSAP-powered accordion panel. Expands/collapses to its natural height with an
 * eased animation on the shared GSAP ticker — no CSS layout thrash, one RAF.
 */
function FaqPanel({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!mounted.current) {
        mounted.current = true;
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }

      if (open) {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: () => el.scrollHeight,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => el.style.setProperty("height", "auto"),
          },
        );
      } else {
        el.style.setProperty("height", `${el.scrollHeight}px`);
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power3.in",
        });
      }
    },
    { dependencies: [open], scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
      {children}
    </div>
  );
}

export function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-colors duration-300",
        isOpen ? "border-primary/60" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between p-6 text-left font-semibold text-foreground"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3 pr-4">
          <HelpCircle className="size-5 shrink-0 text-primary" />
          {question}
        </span>
        <span
          className={cn(
            "text-xl leading-none text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-90",
          )}
        >
          +
        </span>
      </button>
      <FaqPanel open={isOpen}>
        <div className="border-t border-border px-6 pt-4 pb-6 leading-relaxed text-muted-foreground">
          {answer}
        </div>
      </FaqPanel>
    </div>
  );
}
