import { env } from '@/core/config'

const TIMEOUT_MS: number = 15000

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const controller: AbortController = new AbortController()
  const timer: ReturnType<typeof setTimeout> = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res: Response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const json: { success: boolean; data?: T; error?: string } = await res.json()

    if (!res.ok) {
      throw new ApiError(json.error ?? `HTTP ${res.status}`, res.status)
    }

    return json.data as T
  } finally {
    clearTimeout(timer)
  }
}

export function get<T>(path: string, token?: string): Promise<T> {
  return request<T>('GET', path, undefined, token)
}

export function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  return request<T>('POST', path, body, token)
}

export function patch<T>(path: string, body: unknown, token?: string): Promise<T> {
  return request<T>('PATCH', path, body, token)
}

export function del<T>(path: string, token?: string): Promise<T> {
  return request<T>('DELETE', path, undefined, token)
}
