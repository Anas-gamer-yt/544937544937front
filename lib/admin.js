import { apiFetch, getPublicApiBaseUrl } from "@/lib/fetcher";

function tryParseJson(text) {
  const normalizedText = String(text || "").trim();

  if (
    !normalizedText ||
    (!normalizedText.startsWith("{") && !normalizedText.startsWith("["))
  ) {
    return null;
  }

  try {
    return JSON.parse(normalizedText);
  } catch (error) {
    return null;
  }
}

export async function adminRequest(path, options = {}) {
  const { headers = {}, timeoutMs = 20000, ...rest } = options;

  return apiFetch(path, {
    ...rest,
    timeoutMs,
    credentials: "include",
    headers: {
      ...headers
    }
  });
}

export async function getAdminSession() {
  try {
    const payload = await adminRequest("/api/auth/me");
    return payload?.data?.admin || null;
  } catch (error) {
    return null;
  }
}

export async function logoutAdminSession() {
  try {
    await adminRequest("/api/auth/logout", {
      method: "POST"
    });
  } catch (error) {
    return null;
  }

  return true;
}

export async function uploadAdminImages(files) {
  const formData = new FormData();

  Array.from(files || []).forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(
    `${getPublicApiBaseUrl()}/api/uploads/images`,
    {
      method: "POST",
      credentials: "include",
      body: formData
    }
  );

  const text = await response.text();
  const payload = tryParseJson(text);
  const fallbackMessage = String(text || "").trim();

  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage || "Image upload failed");
  }

  return payload?.data || [];
}
