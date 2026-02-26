import { auth } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Make authenticated API request with Firebase token
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    // Get the current user's ID token
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    // Add token to headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

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
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
