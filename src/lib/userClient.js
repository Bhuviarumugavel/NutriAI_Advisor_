export const DEFAULT_USER_ID = "demo-user";

export function getActiveUserId() {
  if (typeof window === "undefined") {
    return DEFAULT_USER_ID;
  }
  const storedId = window.localStorage.getItem("nutriActiveUserId");
  return storedId?.trim() || DEFAULT_USER_ID;
}

export function setActiveUserId(userId) {
  if (typeof window === "undefined") {
    return;
  }
  if (!userId) {
    window.localStorage.removeItem("nutriActiveUserId");
    return;
  }
  window.localStorage.setItem("nutriActiveUserId", userId.trim());
}

export function normalizeHealthConditions(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}
