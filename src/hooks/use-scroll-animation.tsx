import { type ReactNode } from "react";

import { useScrollReveal, type RevealDirection } from "@/hooks/use-scroll-reveal";

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  direction = "up",
  scrub = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "h1" | "h2" | "h3" | "p" | "span";
  direction?: RevealDirection;
  scrub?: boolean;
}) {
  const ref = useScrollReveal<HTMLElement>(direction, delay, scrub);

  return (
    <Tag ref={ref as never} className={`sk-reveal-base ${className}`}>
      {children}
    </Tag>
  );
}
