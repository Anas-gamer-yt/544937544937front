import { STORE_CURRENCY } from "@/lib/constants";
import {
  getFallbackCategories,
  getFallbackPaymentMethods,
  getFallbackProduct,
  getFallbackProducts,
  getFallbackStoreSettings
} from "@/lib/demoCatalog";

const DEFAULT_SERVER_API_BASE_URL = "http://127.0.0.1:5000";
const DEFAULT_BROWSER_API_BASE_URL = "/backend-api";
const PUBLIC_FETCH_TIMEOUT_MS = 3000;

function shouldUseDemoFallback() {
  return (
    process.env.NODE_ENV !== "production" ||
    String(process.env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK || "")
      .trim()
      .toLowerCase() === "true"
  );
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function getServerApiBaseUrl() {
  const configuredValue = stripTrailingSlash(
    process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      DEFAULT_SERVER_API_BASE_URL
  );

  if (!configuredValue || !isAbsoluteUrl(configuredValue)) {
    return DEFAULT_SERVER_API_BASE_URL;
  }

  return configuredValue;
}

export function getPublicApiBaseUrl() {
  const configuredValue = stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const allowAbsolute =
    String(process.env.NEXT_PUBLIC_ALLOW_ABSOLUTE_API_BASE_URL || "")
      .trim()
      .toLowerCase() === "true";

  if (!configuredValue) {
    return DEFAULT_BROWSER_API_BASE_URL;
  }

  if (isAbsoluteUrl(configuredValue)) {
    return allowAbsolute ? configuredValue : DEFAULT_BROWSER_API_BASE_URL;
  }

  return configuredValue.startsWith("/")
    ? configuredValue
    : `/${configuredValue}`;
}

function getRuntimeApiBaseUrl() {
  if (typeof window !== "undefined") {
    return getPublicApiBaseUrl();
  }

  return getServerApiBaseUrl();
}

function buildUrl(path, query = {}) {
  const baseUrl = getRuntimeApiBaseUrl();

  if (!isAbsoluteUrl(baseUrl)) {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === false
      ) {
        return;
      }

      searchParams.set(key, String(value));
    });

    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const queryString = searchParams.toString();

    return queryString
      ? `${normalizedBase}${normalizedPath}?${queryString}`
      : `${normalizedBase}${normalizedPath}`;
  }

  const url = new URL(`${baseUrl}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function tryParseJson(text) {
  const normalizedText = String(text || "").trim();

  if (!normalizedText) {
    return null;
  }

  if (
    !normalizedText.startsWith("{") &&
    !normalizedText.startsWith("[")
  ) {
    return null;
  }

  try {
    return JSON.parse(normalizedText);
  } catch (error) {
    return null;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  const payload = tryParseJson(text);
  const fallbackMessage = String(text || "").trim();

  if (!response.ok) {
    const message =
      payload?.message ||
      fallbackMessage ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.retryAfterSeconds =
      Number(payload?.retryAfterSeconds) ||
      Number(response.headers.get("Retry-After")) ||
      0;
    error.payload = payload;
    error.responseText = fallbackMessage;
    throw error;
  }

  return payload ?? (fallbackMessage ? { success: true, message: fallbackMessage } : null);
}

export async function apiFetch(path, options = {}) {
  const {
    query,
    data,
    headers = {},
    cache,
    next,
    credentials,
    timeoutMs = 10000,
    ...rest
  } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const requestOptions = {
    ...rest,
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      ...headers
    }
  };

  if (credentials !== undefined) {
    requestOptions.credentials = credentials;
  }

  if (data !== undefined) {
    requestOptions.body = JSON.stringify(data);
    requestOptions.headers["Content-Type"] = "application/json";
  }

  if (typeof window === "undefined") {
    requestOptions.cache = cache || "no-store";

    if (next) {
      requestOptions.next = next;
    }
  }

  try {
    const response = await fetch(buildUrl(path, query), requestOptions);
    return parseResponse(response);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("API request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCategories() {
  try {
    const payload = await apiFetch("/api/categories", {
      next: { revalidate: 60 },
      timeoutMs: PUBLIC_FETCH_TIMEOUT_MS
    });
    return payload?.data || [];
  } catch (error) {
    return shouldUseDemoFallback() ? getFallbackCategories() : [];
  }
}

export async function getProducts(query = {}) {
  try {
    const payload = await apiFetch("/api/products", {
      query,
      next: { revalidate: 60 },
      timeoutMs: PUBLIC_FETCH_TIMEOUT_MS
    });
    return payload?.data || [];
  } catch (error) {
    return shouldUseDemoFallback() ? getFallbackProducts(query) : [];
  }
}

export async function getProduct(id) {
  try {
    const payload = await apiFetch(`/api/products/${id}`, {
      next: { revalidate: 60 },
      timeoutMs: PUBLIC_FETCH_TIMEOUT_MS
    });
    return payload?.data || null;
  } catch (error) {
    return shouldUseDemoFallback() ? getFallbackProduct(id) : null;
  }
}

export async function getPaymentMethods() {
  try {
    const payload = await apiFetch("/api/payments", {
      next: { revalidate: 30 },
      timeoutMs: PUBLIC_FETCH_TIMEOUT_MS
    });
    return payload?.data || [];
  } catch (error) {
    return shouldUseDemoFallback() ? getFallbackPaymentMethods() : [];
  }
}

export async function getWhatsAppSettings() {
  try {
    const payload = await apiFetch("/api/settings/whatsapp", {
      timeoutMs: 5000
    });
    return payload?.data || null;
  } catch (error) {
    return shouldUseDemoFallback() ? getFallbackStoreSettings() : null;
  }
}

export async function getCheckoutLocations() {
  try {
    const payload = await apiFetch("/api/settings/checkout-locations", {
      next: { revalidate: 3600 },
      timeoutMs: PUBLIC_FETCH_TIMEOUT_MS
    });
    return payload?.data?.checkoutLocations || {};
  } catch (error) {
    return {};
  }
}

export async function getStoreSettings() {
  return getWhatsAppSettings();
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: STORE_CURRENCY,
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function buildWhatsAppOrderUrl({
  whatsappNumber,
  orderId,
  paymentMethodName,
  total,
  customerName
}) {
  const number = String(whatsappNumber || "").replace(/\D/g, "");

  if (!number) {
    return "";
  }

  const message = [
    "Hello, I have placed a new order.",
    orderId ? `Order ID: ${orderId}` : "",
    customerName ? `Name: ${customerName}` : "",
    paymentMethodName ? `Payment method: ${paymentMethodName}` : "",
    total ? `Order total: ${formatCurrency(total)}` : "",
    "I will share payment proof here."
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
