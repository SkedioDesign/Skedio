import { useEffect, useState } from "react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { clients, type Client } from "@/data/clients";
import { WebpImage } from "@/components/WebpImage";

const ROW_HEIGHT = 44;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function LogoImage({ client, decorative = false }: { client: Client; decorative?: boolean }) {
  const width = Math.max(1, Math.round((ROW_HEIGHT * client.width) / client.height));

  return (
    <WebpImage
      src={client.logo}
      alt={decorative ? "" : `${client.name} logo`}
      loading="lazy"
      decoding="async"
      tabIndex={decorative ? -1 : undefined}
      style={{ width, height: ROW_HEIGHT }}
      className="flex-none object-cover grayscale opacity-60 transition-all duration-200 ease-out hover:scale-[1.05] hover:grayscale-0 hover:opacity-100"
    />
  );
}

function MarqueeRow({
  items,
  direction,
  label,
}: {
  items: Client[];
  direction: "ltr" | "rtl";
  label: string;
}) {
  return (
    <div className="sk-logo-row" role="group" aria-label={label}>
      <div className={`sk-logo-track sk-logo-track--${direction}`}>
        <div className="flex flex-none items-center gap-x-16 pr-16">
          {items.map((client) => (
            <LogoImage key={client.name} client={client} />
          ))}
        </div>
        <div className="flex flex-none items-center gap-x-16 pr-16" aria-hidden="true">
          {items.map((client) => (
            <LogoImage key={`${client.name}-dup`} client={client} decorative />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Clients() {
  const reducedMotion = usePrefersReducedMotion();
  const half = Math.ceil(clients.length / 2);
  const rowOne = clients.slice(0, half);
  const rowTwo = clients.slice(half);

  return (
    <section
      id="clients"
      className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-20 lg:pb-24"
    >
      <div className="lg:grid lg:grid-cols-5 lg:items-center lg:gap-[4.5rem]">
        <ScrollReveal className="lg:col-span-2">
          <div className="relative mb-10 lg:mb-0 lg:pr-10">
            <span
              aria-hidden="true"
              className="absolute -right-9 top-1/2 hidden h-52 w-px -translate-y-1/2 bg-black/10 lg:block"
            />
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Clients
            </h2>
            <p className="mt-4 type-body text-muted-foreground sm:text-lg">
              We'll let the brands speak for us
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" className="lg:col-span-3">
          <div className="relative rounded-[22px] border border-black/[0.06] bg-surface px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {reducedMotion ? (
              <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3">
                {clients.map((client) => (
                  <div key={client.name} className="flex items-center justify-center">
                    <LogoImage client={client} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="relative">
                  <MarqueeRow
                    items={rowOne}
                    direction="rtl"
                    label={`${rowOne.length} client logos, row one`}
                  />
                  <div className="my-5 border-t border-black/[0.06] lg:my-6">
                    <MarqueeRow
                      items={rowTwo}
                      direction="ltr"
                      label={`${rowTwo.length} client logos, row two`}
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-surface to-transparent sm:w-12 lg:w-14"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface to-transparent sm:w-12 lg:w-14"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-surface to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-surface to-transparent"
                />
              </>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
