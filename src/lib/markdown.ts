import { marked } from "marked";

/**
 * Renders markdown to HTML for article bodies.
 *
 * The HTML-significant characters are escaped *before* parsing, so `marked` can
 * only ever emit the tags it generates itself — emphasis, lists, headings,
 * links. Raw HTML embedded in the content becomes literal text instead of
 * markup. That makes the output safe by construction rather than by filtering
 * it afterwards, and it matters for more than security: sanitizing during the
 * React render made the result depend on the host HTML parser (jsdom on the
 * server, the real DOM in the browser), so the two passes could disagree and
 * React would throw away the server markup and re-render the whole root.
 *
 * This replaces `isomorphic-dompurify`, whose bundled build evaluates
 * `fs.readFileSync(path.resolve(__dirname, ...))` at module scope. `__dirname`
 * does not exist in an ES module, so it threw during `renderToReadableStream`
 * and aborted server rendering for every blog article — the server sent a
 * shell with no <main>, no H1 and no article body. The bundled `jsdom` has the
 * identical fault, so a DOM-based sanitizer is not viable here at all.
 *
 * Marked does not reject `javascript:` URLs in link targets, so those are
 * neutralised below. Escaping `<` already prevents tag injection; this closes
 * the remaining URL-scheme route.
 */
const DANGEROUS_URL_SCHEME = /\b(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data):[^"']*\2/gi;

function escapeHtml(source: string): string {
  return source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(escapeHtml(markdown)) as string;
  return html.replace(DANGEROUS_URL_SCHEME, "$1=$2#$2");
}
