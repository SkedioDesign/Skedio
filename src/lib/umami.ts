const API_KEY_HEADER = "Authorization";

const apiBase = process.env["UMAMI_API_URL"] ?? "https://api.umami.is/api";
const apiKey = process.env["UMAMI_API_KEY"] ?? "";
const token = process.env["UMAMI_TOKEN"] ?? apiKey;

export const umamiWebsiteId =
  process.env["UMAMI_WEBSITE_ID"] ??
  (import.meta.env["VITE_UMAMI_WEBSITE_ID"] as string | undefined) ??
  "";

export interface UmamiOverview {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

export interface UmamiMetric {
  label: string;
  count: number;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

async function umamiGet<T>(path: string): Promise<T> {
  if (!token) {
    throw new Error(
      "Umami API credentials missing. Set UMAMI_API_KEY (or UMAMI_TOKEN) in the environment.",
    );
  }

  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      [API_KEY_HEADER]: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Umami API ${response.status} for ${path}: ${body.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

function parseMetricsRows(payload: unknown): UmamiMetric[] {
  const rows = Array.isArray(payload)
    ? payload
    : ((payload as { data?: unknown[] } | undefined)?.data ?? []);
  return rows.map((row) => {
    const entry = row as { x?: unknown; y?: unknown; w?: unknown };
    return { label: String(entry.x ?? entry.w ?? "").trim(), count: toNumber(entry.y) };
  });
}

export interface UmamiRangeOptions {
  startAt: number;
  endAt: number;
  limit?: number;
}

function requireWebsiteId(): string {
  if (!umamiWebsiteId) {
    throw new Error("Umami website ID missing. Set UMAMI_WEBSITE_ID or VITE_UMAMI_WEBSITE_ID.");
  }
  return umamiWebsiteId;
}

export async function getUmamiOverview({
  startAt,
  endAt,
}: UmamiRangeOptions): Promise<UmamiOverview> {
  const websiteId = requireWebsiteId();

  const payload = await umamiGet<Record<string, unknown>>(
    `/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
  );

  return {
    pageviews: toNumber(payload["pageviews"]),
    visitors: toNumber(payload["visitors"]),
    visits: toNumber(payload["visits"]),
    bounces: toNumber(payload["bounces"]),
    totaltime: toNumber(payload["totaltime"]),
  };
}

export async function getUmamiTopPages(options: UmamiRangeOptions): Promise<UmamiMetric[]> {
  const websiteId = requireWebsiteId();
  const { startAt, endAt, limit = 8 } = options;
  const payload = await umamiGet<unknown>(
    `/websites/${websiteId}/metrics?type=path&startAt=${startAt}&endAt=${endAt}&limit=${limit}`,
  );
  return parseMetricsRows(payload);
}

export async function getUmamiTopReferrers(options: UmamiRangeOptions): Promise<UmamiMetric[]> {
  const websiteId = requireWebsiteId();
  const { startAt, endAt, limit = 5 } = options;
  const payload = await umamiGet<unknown>(
    `/websites/${websiteId}/metrics?type=referrer&startAt=${startAt}&endAt=${endAt}&limit=${limit}`,
  );
  return parseMetricsRows(payload);
}
