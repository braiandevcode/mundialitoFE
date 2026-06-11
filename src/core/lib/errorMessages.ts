import { ApiError } from '@/core/api/httpClient'

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Tu sesión expiró. Iniciá sesión de nuevo.'
    return 'Algo salió mal. Intentá de nuevo.'
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'No pudimos conectar con el servidor. Revisá tu conexión a internet.'
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'El servidor no respondió a tiempo. Intentá de nuevo.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}
