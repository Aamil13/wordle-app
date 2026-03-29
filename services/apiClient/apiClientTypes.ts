// ─── HTTP ─────────────────────────────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// ─── Request ──────────────────────────────────────────────────────────────────

export interface RequestData<TBody = unknown> {
  // Body
  data?: TBody | TBody[];

  // Routing
  customBaseUrl?: boolean;

  // Auth
  token?: string;

  // Headers
  headers?: Record<string, string>;
  skipContentType?: boolean;

  // Method override
  method?: HttpMethod;

  // Query params
  id?: string | number;
  page?: number;
  size?: number;
  userCode?: string;
  email?: string;

  // Response transform
  transform?: boolean;
}

export interface FieldsAndFilters<TFilter = Record<string, unknown>> {
  fields?: string[];
  filters?: TFilter & {
    sortField?: string;
    sortOrder?: "asc" | "desc";
  };
  offset?: number;
  limit?: number;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  size?: number;
}

export interface SuccessResponse {
  success: true;
}

/**
 * Union of all possible server response shapes.
 *
 * - A single object:        `T`
 * - An array:               `T[]`
 * - A paginated wrapper:    `PaginatedResponse<T>`
 * - A plain success flag:   `SuccessResponse`
 */
export type ServerResponse<T> =
  | T
  | T[]
  | PaginatedResponse<T>
  | SuccessResponse;
