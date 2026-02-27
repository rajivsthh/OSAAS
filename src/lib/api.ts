import { auth } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getDevIdentity() {
  if (typeof window === "undefined") return null;
  const configuredId = import.meta.env.VITE_DEV_USER_ID as string | undefined;
  if (configuredId) {
    return {
      id: configuredId,
      email: (import.meta.env.VITE_DEV_USER_EMAIL as string | undefined) || "dev@example.com",
      name: (import.meta.env.VITE_DEV_USER_NAME as string | undefined) || "DevUser"
    };
  }

  const storageKey = "apricity-dev-user-id";
  let id = window.localStorage.getItem(storageKey);
  if (!id && "crypto" in window && "randomUUID" in window.crypto) {
    id = `dev-${window.crypto.randomUUID()}`;
    window.localStorage.setItem(storageKey, id);
  }

  if (!id) {
    id = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(storageKey, id);
  }

  if (!id) return null;

  return {
    id,
    email: `${id}@example.com`,
    name: "DevUser"
  };
}

function ensureAuth() {
  const devIdentity = getDevIdentity();
  if (!auth && !devIdentity) {
    throw new Error("Firebase auth is not initialized");
  }
}

/**
 * Make authenticated API request with Firebase token
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    ensureAuth();
    // Get the current user's ID token
    const user = auth?.currentUser;
    const devIdentity = getDevIdentity();
    const token = user ? await user.getIdToken() : "";
    if (!user && !devIdentity) {
      throw new Error("User not authenticated");
    }

    // Add token to headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    if (devIdentity) {
      headers["x-dev-user-id"] = devIdentity.id;
      headers["x-dev-user-email"] = devIdentity.email;
      headers["x-dev-user-name"] = devIdentity.name;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * POST request helper
 */
export async function apiPost(endpoint: string, data: any) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * POST with file upload (multipart/form-data)
 */
export async function apiPostFile(endpoint: string, formData: FormData) {
  try {
    ensureAuth();
    const user = auth?.currentUser;
    const devIdentity = getDevIdentity();
    const token = user ? await user.getIdToken() : "";
    if (!user && !devIdentity) {
      throw new Error("User not authenticated");
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (devIdentity) {
      headers["x-dev-user-id"] = devIdentity.id;
      headers["x-dev-user-email"] = devIdentity.email;
      headers["x-dev-user-name"] = devIdentity.name;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "File upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("File Upload Error:", error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet(endpoint: string) {
  return apiCall(endpoint, {
    method: "GET",
  });
}
