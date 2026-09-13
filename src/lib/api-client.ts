/**
 * APEX API Client
 * 
 * Provides type-safe HTTP communication with the Laravel backend.
 * Automatically injects the Cognito JWT Bearer token from the OIDC session.
 * Does NOT require or expose static API keys on the frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1"

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}


/**
 * Retrieves the current Cognito ID token from OIDC session storage.
 */
export function getCognitoIdToken(): string | null {
  try {
    const authority = import.meta.env.VITE_COGNITO_AUTHORITY
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
    const storageKey = authority && clientId ? `oidc.user:${authority}:${clientId}` : null

    const storages = [sessionStorage, localStorage]

    for (const storage of storages) {
      if (storageKey) {
        const raw = storage.getItem(storageKey)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.id_token || parsed.access_token) {
            return parsed.id_token || parsed.access_token
          }
        }
      }

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith("oidc.user:")) {
          const raw = storage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed.id_token || parsed.access_token) {
              return parsed.id_token || parsed.access_token
            }
          }
        }
      }
    }

    return null
  } catch (error) {
    console.warn("Failed to retrieve Cognito token from storage", error)
    return null
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...customConfig } = options

  let url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`

  if (params) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const token = getCognitoIdToken()

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  }

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: reqHeaders,
  })

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }

    const message =
      (typeof errorData === "object" && errorData !== null && "message" in errorData)
        ? String((errorData as { message: unknown }).message)
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, errorData)
  }

  // If status is 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  const json = await response.json()
  // If wrapped in Laravel's standard data property, return unwrapped or as defined
  return json as T
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: "GET" })
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: "DELETE" })
  },
}
