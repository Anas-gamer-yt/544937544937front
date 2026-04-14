function normalizeUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL
  ];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);

    if (!normalized) {
      continue;
    }

    try {
      return new URL(normalized);
    } catch (error) {
      continue;
    }
  }

  try {
    return new URL("http://localhost:3000");
  } catch (error) {
    return undefined;
  }
}

export function resolveSiteHref(pathname = "/") {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return pathname;
  }

  return new URL(pathname, siteUrl).toString();
}
