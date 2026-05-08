import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// import { forceDeauthenticate } from "@/hooks/Auth/forceDeautenticate";
import {
  PaginatedResponse,
  RequestData,
  ServerResponse,
} from "./apiClientTypes";

const CUSTOM_BASE_URL = process.env.EXPO_PUBLIC_CUSTOM_BASE_URL;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_ERROR_MESSAGES = new Set(["jwt expired", "jwt malformed"]);

// ─── Axios Instance ────────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const message: string | undefined = error.response?.data?.message;
    if (message && JWT_ERROR_MESSAGES.has(message)) {
      // return forceDeauthenticate();
    }
    return Promise.reject(error);
  },
);

// ─── URL Builder ──────────────────────────────────────────────────────────────

function buildUrl(endpoint: string, customBaseUrl: boolean): string {
  const base = customBaseUrl ? CUSTOM_BASE_URL : API_BASE_URL;
  if (!base?.length) return "";
  // Avoid double slashes
  return `${base.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

// ─── Transform Response ───────────────────────────────────────────────────────

function isPaginated<T>(resp: unknown): resp is PaginatedResponse<T> {
  return (
    resp !== null &&
    typeof resp === "object" &&
    !Array.isArray(resp) &&
    "items" in resp &&
    Array.isArray((resp as PaginatedResponse<T>).items)
  );
}

function buildTransformResponse<T>(transform: boolean) {
  return [].concat(
    axios.defaults.transformResponse as any, // @ts-ignore scope ends here
    (resp: ServerResponse<T>) => {
      if (transform && isPaginated<T>(resp)) return resp.items;
      return resp;
    },
  );
}

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * Typed HTTP client built on top of Axios.
 *
 * @template T - Expected shape of the resolved response data.
 * @template U - Shape of the request body.
 *
 * @param endpoint - API path (e.g. `"users/profile"`).
 * @param config   - Optional request configuration.
 *
 * @example
 * // GET  /users?page=1&size=20
 * const users = await client<User[]>("users", { page: 1, size: 20 });
 *
 * @example
 * // POST /auth/login  with a body
 * const session = await client<Session, LoginPayload>("auth/login", {
 *   data: { email, password },
 * });
 */
async function client<T, U = unknown>(
  endpoint: string,
  {
    id,
    page,
    size,
    data,
    headers,
    method,
    transform = true,
    customBaseUrl = false,
    userCode,
    email,
    ...rest
  }: RequestData<U> = {},
): Promise<ServerResponse<T>> {
  const config: AxiosRequestConfig = {
    url: buildUrl(endpoint, customBaseUrl),
    method: method ?? (data ? "POST" : "GET"),
    data: data !== undefined ? JSON.stringify(data) : undefined,
    headers: { ...headers },
    params: { id, page, size, userCode, email },
    transformResponse: buildTransformResponse<T>(transform),
    ...rest,
  };

  try {
    const response = await api<ServerResponse<T>>(config);
    return response.data;
  } catch (err: unknown) {
    // Re-throw a structured error instead of swallowing it silently
    const axiosErr = err as { response?: { data?: { message?: string } } };
    const serverMessage = axiosErr.response?.data?.message ?? "Unknown error";
    return Promise.reject(
      new Error(
        `[API] ${config.method?.toUpperCase()} /${endpoint} — ${serverMessage}`,
      ),
    );
  }
}

export { client };
