import { defineConfig, type Plugin } from "vite";
import { transformWithEsbuild } from "vite";
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
