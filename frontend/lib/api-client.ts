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
  
  let token = "mock-jwt-token-123";
  if (typeof window !== "undefined") {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    if (match) token = match[2];
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = cookies();
      const accessToken = cookieStore.get("access_token");
      if (accessToken) token = accessToken.value;
    } catch (e) {
      // ignore
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new APIError(
      response.status,
      data?.error?.message || data?.message || response.statusText,
      data
    );
  }

  // Handle standard APIResponse wrapper
  return data?.data !== undefined ? data.data : data;
}
