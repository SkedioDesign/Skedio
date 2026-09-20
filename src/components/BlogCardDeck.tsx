import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MoveHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogPosts, type BlogCategoryColor, type BlogPost } from "@/data/blog";

const badgeColors: Record<BlogCategoryColor, string> = {
  purple: "bg-primary",
  orange: "bg-[#f97316]",
  teal: "bg-[#0d9488]",
};

interface SlotGeo {
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  z: number;
}

const SLOT_GEO: SlotGeo[] = [
  { tx: 0, ty: 0, rot: 2.5, scale: 1, z: 30 },
  { tx: -13, ty: -11, rot: 5, scale: 0.955, z: 20 },
  { tx: -26, ty: -22, rot: 7.5, scale: 0.91, z: 10 },
];

const FLY_DX = 620;
const FLY_DY = -90;
const FLY_ROT = 32;
const FLIP_THRESHOLD = 110;
const DRAG_SLOP = 6;
const BASE_ROT = SLOT_GEO[0]!.rot;

const shadowFor = (slot: number) => {
  if (slot === 0)
    return "0 22px 44px -12px rgb(28 20 40 / 0.24), 0 4px 14px -6px rgb(28 20 40 / 0.14)";
  if (slot === 1) return "0 12px 28px -10px rgb(28 20 40 / 0.17)";
  return "0 10px 24px -12px rgb(28 20 40 / 0.15)";
};
const SHADOW_DRAG = "0 30px 64px -18px rgb(28 20 40 / 0.36)";

const faceTransform = (g: { tx: number; ty: number; rot: number; scale: number }) =>
  `translate3d(${g.tx}px, ${g.ty}px, 0) rotate(${g.rot}deg) scale(${g.scale})`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso?: string) {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

function usePrefersReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function Pill({ post }: { post: BlogPost }) {
  if (!post.category) return null;
  return (
    <span
      className={cn(
        "absolute bottom-3 left-3 inline-flex -rotate-3 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md",
        badgeColors[post.categoryColor ?? "purple"],
      )}
    >
      {post.category}
    </span>
  );
}

function CardFace({ post }: { post: BlogPost }) {
  return (
    <>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <img
          src={post.previewImage}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
        />
        <Pill post={post} />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <h3 className="line-clamp-2 font-display text-lg font-extrabold leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="type-caption text-muted-foreground">{fmtDate(post.publishedAt)}</span>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full py-1 text-sm font-bold text-primary transition-colors duration-200 hover:text-primary-hover"
          >
            Read
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function CardShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-inset ring-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface FlyState {
  idx: number;
  from: { tx: number; ty: number; rot: number; scale: number };
  dir: 1 | -1;
}

function FlyCard({
  post,
  fly,
  reduced,
  onDone,
}: {
  post: BlogPost;
  fly: FlyState;
  reduced: boolean;
  onDone: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = reduced ? 160 : 520;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${t}ms cubic-bezier(0.4, 0, 0.82, 0.42), opacity ${t * 0.85}ms ease`;
        el.style.transform = faceTransform({
          tx: fly.dir * FLY_DX,
          ty: fly.from.ty + FLY_DY,
          rot: fly.dir * FLY_ROT + fly.from.rot,
          scale: 0.88,
        });
        el.style.opacity = "0";
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [fly, reduced]);

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 220 : 700);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-50 select-none"
      style={{ transform: faceTransform(fly.from), opacity: 1 }}
    >
      <CardShell>
        <CardFace post={post} />
      </CardShell>
    </div>
  );
}

export function BlogCardDeck({ posts = blogPosts.slice(0, 3) }: { posts?: BlogPost[] }) {
  const reduced = usePrefersReducedMotion();
  const [flips, setFlips] = useState(0);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [nudge, setNudge] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, moved: false, dir: 1 as 1 | -1 });
  const posRef = useRef({ dx: 0, dy: 0 });
  const kbdRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const total = posts.length;
  const dealt = flips >= total;
  const remaining = posts.slice(flips);

  useEffect(() => {
    if (reduced || dealt) return;
    const id = setInterval(() => {
      if (!dragRef.current.dragging && !hovering) setNudge(true);
    }, 4800);
    return () => clearInterval(id);
  }, [reduced, dealt, hovering]);

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(false), 560);
    return () => clearTimeout(t);
  }, [nudge]);

  const finishFly = useCallback(() => setFly(null), []);

  const doFlip = useCallback(
    (dir: 1 | -1, from?: { tx: number; ty: number; rot: number; scale: number }) => {
      if (flips >= posts.length) return;
      setFly({
        idx: flips,
        from: from ?? { tx: 0, ty: 0, rot: BASE_ROT, scale: 1 },
        dir,
      });
      setDrag(null);
      posRef.current = { dx: 0, dy: 0 };
      setFlips((f) => Math.min(f + 1, posts.length));
    },
    [flips, posts.length],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || (e.pointerType === "mouse" && e.button !== 0)) return;
      const el = e.currentTarget;
      if (el.setPointerCapture) {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
        dir: 1,
      };
      posRef.current = { dx: 0, dy: 0 };
      setNudge(false);
    },
    [reduced],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > DRAG_SLOP) d.moved = true;
    if (!d.moved) return;
    d.dir = dx < 0 ? -1 : 1;
    posRef.current = { dx, dy };
    setDrag({ dx, dy });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d.dragging) return;
      d.dragging = false;

      const { dx, dy } = posRef.current;
      const fast = Math.hypot(e.movementX, e.movementY) > 0.55;
      if (d.moved && (Math.abs(dx) > FLIP_THRESHOLD || fast)) {
        doFlip(d.dir, {
          tx: dx,
          ty: dy * 0.35,
          rot: BASE_ROT + dx * 0.07,
          scale: 0.99,
        });
      } else if (d.moved) {
        posRef.current = { dx: 0, dy: 0 };
        setDrag(null);
      } else {
        doFlip(1);
      }
    },
    [doFlip],
  );

  const onPointerCancel = useCallback(() => {
    dragRef.current.dragging = false;
    posRef.current = { dx: 0, dy: 0 };
    setDrag(null);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      kbdRef.current = true;
      doFlip(1);
    },
    [doFlip],
  );

  useEffect(() => {
    if (!kbdRef.current) return;
    stageRef.current?.querySelector<HTMLElement>("[data-deck-top]")?.focus();
    kbdRef.current = false;
  }, [flips]);

  const shuffleAgain = useCallback(() => {
    posRef.current = { dx: 0, dy: 0 };
    setDrag(null);
    setFly(null);
    setFlips(0);
  }, []);

  const isReduced = reduced;

  return (
    <div ref={stageRef} className="relative mx-auto w-full max-w-[356px] select-none px-2">
      <div
        className="relative h-[26rem] sm:h-[29rem]"
        role="group"
        aria-roledescription="Blog card deck"
        aria-label="Flip through recent articles"
      >
        <div key={flips} className="absolute inset-0">
          {remaining.map((post, i) => {
            const isTop = i === 0;
            const slot = SLOT_GEO[i]!;
            const geo =
              isTop && drag
                ? { tx: drag.dx, ty: drag.dy * 0.35, rot: BASE_ROT + drag.dx * 0.07, scale: 0.99 }
                : isTop
                  ? { tx: slot.tx, ty: hovering ? -5 : slot.ty, rot: slot.rot, scale: slot.scale }
                  : { tx: slot.tx, ty: slot.ty, rot: slot.rot, scale: slot.scale };

            return (
              <div
                key={post.slug}
                className="sk-deck-rise absolute inset-0"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div
                  className={cn(
                    "sk-deck-card absolute inset-0",
                    isTop && "cursor-grab",
                    isTop && drag && "sk-deck-card--dragging cursor-grabbing",
                    isTop && nudge && "sk-deck-card--nudge",
                    !isTop && "pointer-events-none",
                  )}
                  style={{
                    transform: faceTransform(geo),
                    zIndex: slot.z,
                    boxShadow: isTop && drag ? SHADOW_DRAG : shadowFor(i),
                    ["--sk-deck-rest" as string]: `${slot.rot}deg`,
                  }}
                  {...(isTop
                    ? {
                        role: "button",
                        tabIndex: 0,
                        "data-deck-top": "",
                        "aria-label": `Flip to the next article. ${post.title}`,
                        onPointerDown,
                        onPointerMove,
                        onPointerUp,
                        onPointerCancel,
                        onKeyDown,
                        onMouseEnter: () => setHovering(true),
                        onMouseLeave: () => setHovering(false),
                        onAnimationEnd: () => setNudge(false),
                      }
                    : { "aria-hidden": true })}
                >
                  <CardShell>
                    <CardFace post={post} />
                  </CardShell>
                </div>
              </div>
            );
          })}

          {fly && (
            <FlyCard post={posts[fly.idx]!} fly={fly} reduced={isReduced} onDone={finishFly} />
          )}

          {dealt && (
            <div
              className="sk-deck-rise absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60"
              role="status"
            >
              <p className="font-display text-lg font-extrabold tracking-tight">
                The stack's been dealt.
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Three reads, laid out for you.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={shuffleAgain}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground transition-colors duration-200 hover:bg-primary"
                >
                  <RotateCcw className="size-4" />
                  Shuffle again
                </button>
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-ink"
                >
                  All articles
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-7 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/10 blur-xl"
        />
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-out",
                i < flips + 1 ? "w-6 bg-primary" : "w-1.5 bg-foreground/15",
              )}
            />
          ))}
        </div>

        <p className="type-caption font-semibold text-muted-foreground" aria-live="polite">
          {dealt ? "3 of 3" : `${flips + 1} of ${total}`}
        </p>

        {!dealt && (
          <span className="type-caption inline-flex items-center gap-1.5 text-muted-foreground">
            <MoveHorizontal className="sk-deck-hint-arrow size-4" aria-hidden="true" />
            {reduced ? "tap the card" : "drag to flip"}
          </span>
        )}
      </div>
    </div>
  );
}
