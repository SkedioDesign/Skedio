import "../instrument.server.mjs";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import type { Register } from "@tanstack/react-router";
import type { RequestHandler } from "@tanstack/react-start/server";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import { consumeLastCapturedError } from "./lib/error-capture";
import { captureServerError, flushServerErrors } from "./lib/sentry-server";
import { renderErrorPage } from "./lib/error-page";
import { generateSitemapXml } from "./lib/sitemap-generator";
import { generateRssFeedXml } from "./lib/rss-generator";
import { getUmamiOverview, getUmamiTopPages, getUmamiTopReferrers } from "./lib/umami";
import { digestRangeLabel, sendDigestEmail } from "./lib/weekly-digest";
import { siteConfig } from "./lib/site-config";
import { runWithNonce } from "./lib/nonce-context";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://cloud.umami.is`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://formsubmit.co https://gateway.umami.is https://o4512119811014656.ingest.us.sentry.io",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' https://formsubmit.co",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function handleWeeklyDigest(request: Request): Promise<Response> {
  // Only Vercel's cron scheduler (or a caller holding the same secret) may
  // invoke this. Vercel attaches the CRON_SECRET env var as
  // `Authorization: Bearer <value>`.
  const cronSecret = process.env["CRON_SECRET"];
  const authHeader = request.headers.get("authorization");
  if (!cronSecret) {
    console.warn("[weekly-digest] Rejected unauthorized cron invocation.");
    return new Response("Unauthorized", { status: 401 });
  }

  const expected = createHash("sha256").update(`Bearer ${cronSecret}`).digest();
  const supplied = createHash("sha256")
    .update(authHeader ?? "")
    .digest();
  if (!timingSafeEqual(expected, supplied)) {
    console.warn("[weekly-digest] Rejected unauthorized cron invocation.");
    return new Response("Unauthorized", { status: 401 });
  }

  const endAt = Date.now();
  const startAt = endAt - WEEK_MS;

  try {
    const [overview, topPages, topReferrers] = await Promise.all([
      getUmamiOverview({ startAt, endAt }),
      getUmamiTopPages({ startAt, endAt, limit: 8 }),
      getUmamiTopReferrers({ startAt, endAt, limit: 5 }),
    ]);

    const rangeLabel = digestRangeLabel(startAt, endAt);
    await sendDigestEmail({
      siteName: siteConfig.name,
      siteUrl: siteConfig.url,
      rangeLabel,
      overview,
      topPages,
      topReferrers,
    });
    console.log(
      `[weekly-digest] Sent weekly analytics digest for ${rangeLabel} (pageviews=${overview.pageviews}, visitors=${overview.visitors}).`,
    );
    return Response.json({
      ok: true,
      range: rangeLabel,
      pageviews: overview.pageviews,
      visitors: overview.visitors,
    });
  } catch (error) {
    console.error("[weekly-digest] Failed to send weekly analytics digest:", error);
    captureServerError(error, "weekly-digest");
    await flushServerErrors();
    return new Response(JSON.stringify({ ok: false, error: "Digest failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

const handle = createStartHandler(defaultStreamHandler);

const fetchHandler: RequestHandler<Register> = async (request) => {
  try {
    const url = new URL(request.url);
    if (url.pathname === "/sitemap.xml") {
      return new Response(generateSitemapXml(), {
        status: 200,
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    if (url.pathname === "/insights/feed.xml") {
      return new Response(generateRssFeedXml(), {
        status: 200,
        headers: {
          "content-type": "application/rss+xml; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    if (url.pathname === "/api/cron/digest") {
      return await handleWeeklyDigest(request);
    }

    const nonce = randomBytes(16).toString("base64");
    const response = await runWithNonce(nonce, async () => {
      const rendered = await handle(request);
      const headers = new Headers(rendered.headers);
      headers.set("content-security-policy", buildContentSecurityPolicy(nonce));
      return new Response(rendered.body, {
        status: rendered.status,
        statusText: rendered.statusText,
        headers,
      });
    });
    if (response.status < 500) return response;
    const captured = consumeLastCapturedError();
    if (captured === undefined) return response;
    captureServerError(captured);
    await flushServerErrors();
    return new Response(renderErrorPage(), {
      status: response.status,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    const captured = consumeLastCapturedError() ?? error;
    captureServerError(captured);
    await flushServerErrors();
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
};

export type ServerEntry = { fetch: RequestHandler<Register> };

export function createServerEntry(entry: ServerEntry): ServerEntry {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    },
  };
}

export default createServerEntry(
  wrapFetchWithSentry({
    fetch: (request: Request) => fetchHandler(request),
  }),
);
