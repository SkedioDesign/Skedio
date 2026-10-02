import { defineConfig, type Plugin } from "vite";
import { transformWithEsbuild } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Strips `console.*` calls from production client chunks so they never reach the
 * browser. The server bundle is excluded via the `client` environment consumer:
 * Nitro builds its own server environments (consumer "server"), and keeping
 * those intact preserves server logging (server.ts and the console-wrapping
 * done in error-capture.ts). esbuild only runs here as a
 * minifier for the drop step; heavy/standard minification stays with
 * Vite/Rolldown's default.
 */
const stripConsoleOnClient = (): Plugin => ({
  name: "skedio:strip-client-console",
  apply: "build",
  applyToEnvironment(environment) {
    return environment.config.consumer === "client";
  },
  async transform(code, id) {
    if (!/console\.(log|debug|info|warn|error|trace)\(/.test(code)) return null;
    const result = await transformWithEsbuild(code, id, {
      loader: "js",
      drop: ["console"],
    });
    return { code: result.code, map: null };
  },
});

/**
 * Dev-only on-demand WebP converter.
 *
 * <WebpImage> renders a `<source type="image/webp">` pointing at a `.webp`
 * twin of every raster image. Those twins are emitted at build time by
 * scripts/optimize-images.mjs, but `vite dev` serves `public/` and `src/assets`
 * as-is, so the twins do not exist and every image would 404 (browsers show a
 * broken image once a <picture> source is selected — they do not fall back).
 *
 * This middleware synthesizes the twin on first request by converting the
 * sibling `.jpg`/`.jpeg`/`.png` with sharp (same settings as the build script)
 * and caches the result for the session. Requests that resolve to a real `.webp`
 * file on disk are passed through untouched so Vite serves them normally.
 */
const devWebpMiddleware = (): Plugin => {
  const cache = new Map<string, Buffer>();
  return {
    name: "skedio:dev-webp",
    apply: "serve",
    configureServer(server) {
      const root = server.config.root;
      const publicDir = server.config.publicDir;
      const bases = [root, ...(publicDir ? [publicDir] : [])];
      const exists = async (p: string) => {
        try {
          await fs.access(p);
          return true;
        } catch {
          return false;
        }
      };
      server.middlewares.use((req, res, next) => {
        void (async () => {
          const rawPath = (req.url ?? "").split("?")[0] ?? "";
          if (!rawPath.endsWith(".webp")) return next();
          let pathname = rawPath;
          try {
            pathname = decodeURIComponent(rawPath);
          } catch {
            // Malformed escape sequence — let Vite produce the normal response.
          }

          try {
            for (const base of bases) {
              if (await exists(path.join(base, pathname))) return next();
            }
            for (const ext of [".jpg", ".jpeg", ".png"]) {
              const sibling = pathname.replace(/\.webp$/i, ext);
              for (const base of bases) {
                const source = path.join(base, sibling);
                if (!(await exists(source))) continue;
                let out = cache.get(source);
                if (!out) {
                  const sharp = (await import("sharp")).default;
                  out = await sharp(source, { failOn: "none" })
                    .webp({ quality: 76, effort: 4 })
                    .toBuffer();
                  cache.set(source, out);
                }
                res.statusCode = 200;
                res.setHeader("content-type", "image/webp");
                res.setHeader("cache-control", "no-cache");
                res.end(out);
                return;
              }
            }
            next();
          } catch (err) {
            next(err as Error);
          }
        })();
      });
    },
  };
};

export default defineConfig({
  css: { transformer: "lightningcss" },
  resolve: { tsconfigPaths: true },
  build: {
    // Modern baseline target (matches Vite's default): ES2022-class syntax,
    // no downlevel transforms/polyfills for Array.from, optional chaining,
    // etc. Do NOT lower this to support legacy browsers — that would
    // reintroduce transpiled helpers into every client chunk.
    target: "baseline-widely-available",
    rolldownOptions: {
      output: {
        // Split heavy vendor libs into separately cacheable chunks instead of a
        // single monolithic index bundle.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@tanstack")) return "router";
          // ScrollTrigger drives scroll-linked reveals only (below the fold).
          // It loads on demand via lib/animation-loader.ts — keep it out of
          // the initial gsap chunk so its parse/execute cost and unused bytes
          // move off the critical path. GSAP core + SplitText stay eager for
          // the above-fold hero entrance. Must precede the generic "gsap"
          // rule: the ScrollTrigger path also contains "gsap".
          if (id.includes("gsap/ScrollTrigger")) return "gsap-st";
          if (id.includes("gsap")) return "gsap";
          // Lenis opts out of manual chunking entirely (returns undefined) so
          // the `import("lenis/react")` in components/LenisProvider.tsx keeps
          // ownership of its chunk. That import fires on main-thread idle, and
          // it is the ONLY thing that should decide when ~20 KB of smooth-scroll
          // code (5.7 KB brotli) is fetched.
          //
          // Any manualChunks name here overrides that dynamic boundary and puts
          // Lenis in the STATIC import graph of every route chunk — the homepage
          // then ships `<link rel="modulepreload" href="/assets/lenis-*.js">`
          // and the browser downloads it during LCP, long before LenisProvider
          // asks for it. Beware the obvious fixes: deleting a `return "lenis"`
          // rule is not enough, because `node_modules/lenis/dist/lenis-react.mjs`
          // then matches the generic `includes("react")` rule below and
          // `lenis.mjs` matches the `vendor` catch-all — both eager, verified by
          // build. Excluding the package here is what actually keeps it lazy.
          if (id.includes("/lenis/")) return;
          if (id.includes("lucide-react")) return "lucide";
          // EXPLICIT package match, not `id.includes("react")`. A substring
          // test matches any path containing "react" anywhere, so a package
          // whose name merely STARTS with "react" (react-hook-form,
          // react-day-picker, react-resizable-panels, react-remove-scroll, …)
          // gets hoisted into the eager React chunk and downloaded by every
          // route on first paint — including routes that never touch it. None
          // of those are installed today, so this is preventative, but the
          // failure mode is silent and expensive when it does happen.
          //
          // The regex is deliberately greedy: pnpm ids look like
          // `/…/Skedio/node_modules/.pnpm/react@19.3.0/node_modules/react/index.js`,
          // so the leading `.*` backtracks to the LAST `node_modules/` and
          // yields the real package name (`react`) instead of the store
          // directory (`.pnpm`).
          const pkg = /.*\/node_modules\/(?:@[^/]+\/)?([^/]+)\//.exec(id)?.[1];
          if (
            pkg === "react" ||
            pkg === "react-dom" ||
            pkg === "scheduler" ||
            // Grouped with React on purpose: it is the shim
            // @tanstack/react-store uses, so it genuinely is on the critical
            // path. Letting it fall through to `vendor` would merge it with
            // `marked` (used only by /blog and /insights) and put a blog-only
            // dependency on the critical path of every other route.
            pkg === "use-sync-external-store"
          ) {
            return "react";
          }
          return "vendor";
        },
      },
    },
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    // Preset is overridable so `build:node` can emit a self-serving bundle for
    // local production preview. The "vercel" preset emits a serverless function
    // (.vercel/output/functions/__server.func/) that does not self-serve, so
    // `bun run start` can only ever work against a node-server build.
    // Bracket notation: this project has noPropertyAccessFromIndexSignature.
    //
    // compressPublicAssets pre-compresses the static bundle. Production
    // (Vercel) brotli-gzipps at the edge whether or not this is set, but the
    // node-server preview did NOT — it shipped ~130KB of CSS and ~289KB of
    // router JS raw. Measuring that under a Slow 4G profile overstates LCP by
    // seconds and hides the real bottleneck, so the preview is now configured
    // to behave like the edge it is meant to approximate.
    nitro({
      preset: process.env["NITRO_PRESET"] ?? "vercel",
      compressPublicAssets: true,
    }),
    viteReact(),
    tailwindcss(),
    devWebpMiddleware(),
    stripConsoleOnClient(),
  ],
});
