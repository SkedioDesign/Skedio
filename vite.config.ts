import { defineConfig, type Plugin } from "vite";
import { transformWithEsbuild } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Strips `console.*` calls from production client chunks so they never reach the
 * browser. The server bundle is excluded via the `client` environment consumer:
 * Nitro builds its own server environments (consumer "server"), and keeping
 * those intact preserves server logging (server.ts, sentry-server.ts, and the
 * console-wrapping done in error-capture.ts). esbuild only runs here as a
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
    rolldownOptions: {
      output: {
        // Split heavy vendor libs into separately cacheable chunks instead of a
        // single monolithic index bundle.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@radix-ui")) return "radix-ui";
          if (id.includes("@tanstack")) return "router";
          if (id.includes("gsap")) return "gsap";
          if (id.includes("lenis")) return "lenis";
          if (id.includes("@sentry")) return "sentry";
          if (id.includes("embla")) return "embla";
          if (id.includes("lucide-react")) return "lucide";
          if (id.includes("react")) return "react";
          return "vendor";
        },
      },
    },
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({ preset: "vercel" }),
    viteReact(),
    tailwindcss(),
    devWebpMiddleware(),
    stripConsoleOnClient(),
    // Uploads source maps to Sentry on build. Only active when
    // SENTRY_AUTH_TOKEN is set (see .env.example), so local/CI builds without a
    // token still succeed.
    ...(process.env["SENTRY_AUTH_TOKEN"]
      ? [
          sentryTanstackStart({
            org: "skedio-qm",
            project: "javascript-tanstackstart-react",
            authToken: process.env["SENTRY_AUTH_TOKEN"],
          }),
        ]
      : []),
  ],
});
