export const DEFAULT_USER_ID = "demo-user";

export function getActiveUserId() {
  if (typeof window === "undefined") {
    return DEFAULT_USER_ID;
  }
  const stored = window.localStorage.getItem("nutriActiveUserEmail");
  return stored?.trim() || DEFAULT_USER_ID;
}

export function setActiveUserId(userEmail) {
  if (typeof window === "undefined") {
    return;
  }
  if (!userEmail) {
    window.localStorage.removeItem("nutriActiveUserEmail");
    window.dispatchEvent(new Event("nutriActiveUserIdChanged"));
    return;
  }
  window.localStorage.setItem("nutriActiveUserEmail", userEmail.trim());
  window.dispatchEvent(new Event("nutriActiveUserIdChanged"));
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
