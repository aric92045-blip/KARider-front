import type { ApiError } from '@/core/http/apiError'

/** Texto para mostrar en un aviso. La decisión se toma por `code`, nunca por el texto. */
export function mensajeDeError(e: ApiError): string {
  switch (e.code) {
    case 'SIN_CONEXION':
    case 'BASE_DATOS_NO_DISPONIBLE':
      return 'No pudimos conectar con el servidor. Intenta de nuevo en unos segundos.'
    case 'ERROR_INTERNO':
    case 'ERROR_CLIENTE':
      return e.traceId
        ? `Ocurrió un error inesperado. Si continúa, comparte este folio con soporte: ${e.traceId}`
        : 'Ocurrió un error inesperado. Intenta de nuevo.'
    default:
      return e.detail
  }
}
