import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import type { Register } from "@tanstack/react-router";
import type { RequestHandler } from "@tanstack/react-start/server";
import { consumeLastCapturedError, describeError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { generateSitemapXml } from "./lib/sitemap-generator";

const handle = createStartHandler(defaultStreamHandler);

const fetch: RequestHandler<Register> = async (request) => {
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

    const response = await handle(request);
    if (response.status < 500) return response;
    const captured = consumeLastCapturedError();
    if (captured === undefined) return response;
    console.error(describeError(captured));
    return new Response(renderErrorPage(), {
      status: response.status,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    const captured = consumeLastCapturedError() ?? error;
    console.error(describeError(captured));
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

export default createServerEntry({ fetch });
