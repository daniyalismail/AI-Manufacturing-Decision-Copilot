export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class APIError extends Error {
  constructor(public status: number, public message: string, public data?: any) {
    super(message);
    this.name = "APIError";
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let token: string | null = null;
  if (typeof window !== "undefined") {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    if (match) token = match[2];
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("access_token");
      if (accessToken) token = accessToken.value;
    } catch (e) {
      // ignore
    }
  }

  const headers: Record<string, string> = {
    ...options.headers as any,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if it's not FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Clear token and redirect to login
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
    
    throw new APIError(
      response.status,
      data?.error?.message || data?.message || response.statusText,
      data
    );
  }

  // Handle standard APIResponse wrapper
  return data?.data !== undefined ? data.data : data;
}
