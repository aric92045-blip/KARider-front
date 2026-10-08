import type { AxiosError } from 'axios'

/** Error normalizado a partir de las respuestas Problem Details de la API. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public detail: string,
    public errors: Record<string, string[]> = {},
    public traceId?: string,
    /** Segundos indicados por la cabecera Retry-After (429). */
    public retryAfter?: number,
  ) {
    super(detail)
    this.name = 'ApiError'
  }
}

interface ProblemDetails {
  code?: string
  detail?: string
  errors?: Record<string, string[]>
  traceId?: string
}

export function aApiError(e: AxiosError<ProblemDetails>): ApiError {
  if (!e.response) {
    return new ApiError(
      0,
      'SIN_CONEXION',
      'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.',
    )
  }
  const d = e.response.data ?? {}
  const retry = Number(e.response.headers?.['retry-after'])
  return new ApiError(
    e.response.status,
    d.code ?? 'ERROR_HTTP',
    d.detail ?? 'Ocurrió un error inesperado.',
    d.errors ?? {},
    d.traceId,
    Number.isFinite(retry) && retry > 0 ? retry : undefined,
  )
}

/** Cualquier error (de red, de la API o de programación) como ApiError. */
export function comoApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e
  return new ApiError(-1, 'ERROR_CLIENTE', 'Ocurrió un error inesperado. Intenta de nuevo.')
}
