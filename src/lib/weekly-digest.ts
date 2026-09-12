import type { UmamiMetric, UmamiOverview } from "./umami";
import { siteConfig } from "./site-config";

export function digestRangeLabel(startAt: number, endAt: number): string {
  const format = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${format(startAt)} – ${format(endAt)}`;
}

export interface DigestReport {
  siteName: string;
  siteUrl: string;
  rangeLabel: string;
  overview: UmamiOverview;
  topPages: UmamiMetric[];
  topReferrers: UmamiMetric[];
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0 && minutes === 0) return `${Math.floor(totalSeconds)}s`;
  if (hours === 0) return `${minutes}m`;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function bounceRate(overview: UmamiOverview): string {
  if (overview.visits === 0) return "0%";
  return `${((overview.bounces / overview.visits) * 100).toFixed(1)}%`;
}

function metricList(metrics: UmamiMetric[]): string {
  if (metrics.length === 0) return "  — no data in this period";
  return metrics.map((m, i) => `  ${i + 1}. ${m.label} — ${m.count}`).join("\n");
}

function metricListHtml(metrics: UmamiMetric[]): string {
  if (metrics.length === 0)
    return "<tr><td colspan='2' style='padding:6px 0;color:#64748b;'>No data in this period.</td></tr>";
  return metrics
    .map(
      (m, i) =>
        `<tr><td style='padding:6px 0;border-bottom:1px solid #eef0f3;'>${i + 1}. ${escapeHtml(m.label)}</td>` +
        `<td style='padding:6px 0;border-bottom:1px solid #eef0f3;text-align:right;font-variant-numeric:tabular-nums;'>${m.count}</td></tr>`,
    )
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statRow(label: string, value: string): string {
  return (
    `<tr><td style='padding:6px 0;color:#475569;'>${label}</td>` +
    `<td style='padding:6px 0;text-align:right;font-weight:600;font-variant-numeric:tabular-nums;'>${escapeHtml(value)}</td></tr>`
  );
}

export function buildDigestEmail(report: DigestReport): {
  subject: string;
  text: string;
  html: string;
} {
  const { overview, rangeLabel, siteName, siteUrl } = report;

  const subject = `${siteName} — Weekly Site Analytics (${rangeLabel})`;

  const summaryLines = [
    `${siteName} weekly analytics — ${rangeLabel}`,
    "",
    `Pageviews        ${overview.pageviews}`,
    `Unique visitors  ${overview.visitors}`,
    `Visits           ${overview.visits}`,
    `Bounce rate      ${bounceRate(overview)}`,
    `Time on site     ${formatDuration(overview.totaltime)}`,
    "",
    "Top pages:",
    metricList(report.topPages),
    "",
    "Top referrers:",
    metricList(report.topReferrers),
    "",
    siteUrl,
  ];
  const text = summaryLines.join("\n");

  const html = `<div style="font-family:ui-sans-serif,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;max-width:560px;">
  <h2 style="font-size:18px;margin:0 0 4px;">${escapeHtml(siteName)} — Weekly Site Analytics</h2>
  <p style="color:#64748b;margin:0 0 20px;">${escapeHtml(rangeLabel)}</p>
  <table role="presentation" style="border-collapse:collapse;width:100%;">
    ${statRow("Pageviews", String(overview.pageviews))}
    ${statRow("Unique visitors", String(overview.visitors))}
    ${statRow("Visits", String(overview.visits))}
    ${statRow("Bounce rate", bounceRate(overview))}
    ${statRow("Total time on site", formatDuration(overview.totaltime))}
  </table>
  <h3 style="font-size:14px;margin:24px 0 8px;color:#8537F4;">Top pages</h3>
  <table role="presentation" style="border-collapse:collapse;width:100%;">
    ${metricListHtml(report.topPages)}
  </table>
  <h3 style="font-size:14px;margin:24px 0 8px;color:#8537F4;">Top referrers</h3>
  <table role="presentation" style="border-collapse:collapse;width:100%;">
    ${metricListHtml(report.topReferrers)}
  </table>
  <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">Data from Umami Analytics for ${escapeHtml(siteUrl)}</p>
</div>`;

  return { subject, text, html };
}

export async function sendDigestEmail(report: DigestReport): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"] ?? "";
  if (!apiKey) {
    throw new Error("Resend API key missing. Set RESEND_API_KEY in the environment.");
  }

  const to = process.env["DIGEST_TO_EMAIL"] ?? "skediodesignspace@gmail.com";
  const from = process.env["RESEND_FROM_EMAIL"] ?? "onboarding@resend.dev";
  const { subject, text, html } = buildDigestEmail(report);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend send failed (${response.status}): ${body.slice(0, 300)}`);
  }
}
