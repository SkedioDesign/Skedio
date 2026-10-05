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

/**
 * GitHub-flavoured heading slug, so an article's hand-written table of contents
 * resolves. The exact rules matter because the anchors are written by hand in
 * the content and cannot be checked against the headings that produce them:
 * lowercase, drop anything that isn't a letter, digit, space or hyphen, then
 * spaces to hyphens. `How to Build a Startup Design System (Step by Step)`
 * therefore becomes `how-to-build-a-startup-design-system-step-by-step`.
 *
 * `marked` dropped its built-in `headerIds` option in v8, and its default
 * heading renderer emits no `id` at all — every in-page table of contents on
 * the blog was dead before this.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Headings are numbered per render, not per module: `renderMarkdown` is called
 * once per request, and two posts that both contain a "Conclusion" heading must
 * not collide on the same document.
 */
const headingIds = new Map<string, number>();

const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  // `parseInline` returns HTML, so strip tags before slugging — an emphasised
  // word would otherwise slug on its markup (`<em>`) and lose its letters.
  const base = slugify(text.replace(/<[^>]*>/g, ""));
  const seen = headingIds.get(base) ?? 0;
  headingIds.set(base, seen + 1);
  // Repeats get a numeric suffix rather than sharing an id, which would make
  // every later link on the page jump to the first one.
  const id = seen === 0 ? base : `${base}-${seen}`;
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

/**
 * Wraps tables so they can scroll.
 *
 * A `<table>` cannot scroll its own overflow, so a wide table inside a narrow
 * column pushes the whole document sideways — measured at 555px of document
 * width on a 320px screen for the design-system article's comparison tables.
 * `overflow-x: auto` only works on a block box, so the wrapper supplies it and
 * the table keeps its natural width inside.
 */
const originalTable = renderer.table.bind(renderer);
renderer.table = (token) => `<div class="sk-table-scroll">${originalTable(token)}</div>\n`;

export function renderMarkdown(markdown: string): string {
  headingIds.clear();
  const html = marked.parse(escapeHtml(markdown), { renderer }) as string;
  return html.replace(DANGEROUS_URL_SCHEME, "$1=$2#$2");
}
