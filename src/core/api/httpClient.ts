import { env } from '@/core/config'

const TIMEOUT_MS: number = 15000

interface IApiResponse<T> {
  success?: boolean
  data?: T
  error?: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const buildHeaders = (body: unknown, token?: string): Record<string, string> => {
  const headers: Record<string, string> = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

const parseResponse = <T>(text: string, status: number): IApiResponse<T> | null => {
  if (!text) return null

  try {
    return JSON.parse(text) as IApiResponse<T>
  } catch {
    throw new ApiError(`HTTP ${status}: respuesta invalida del servidor`, status)
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

  const headers: Record<string, string> = buildHeaders(body, token)

  try {
    const res: Response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const text: string = await res.text()
    const json: IApiResponse<T> | null = parseResponse<T>(text, res.status)

    if (!res.ok) {
      throw new ApiError(json?.error ?? `HTTP ${res.status}`, res.status)
    }

    if (json?.success === false) {
      throw new ApiError(json.error ?? `HTTP ${res.status}`, res.status)
    }

    return json?.data as T
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
