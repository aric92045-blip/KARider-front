import { isRef, ref, type Ref } from 'vue'
import type { z } from 'zod'
import { comoApiError, type ApiError } from '@/core/http/apiError'

export type Errores = Record<string, string>

interface Opciones<T> {
  /** Ajusta los valores antes de validar (ej. quitar el vehículo si el rol es Pasajero). */
  preparar?: (valores: T) => unknown
}

/**
 * Estado de un formulario validado con Zod: valores, errores por campo (llave con punto,
 * ej. "vehiculo.placas", igual que la API) y un error general para mostrar en un aviso.
 */
export function useFormulario<S extends z.ZodType, T extends object>(
  esquema: S,
  /** Valores iniciales, o un Ref existente (ej. el borrador de un store) para editarlo en sitio. */
  iniciales: T | Ref<T>,
  opciones: Opciones<T> = {},
) {
  const valores = (isRef(iniciales) ? iniciales : ref(structuredClone(iniciales))) as Ref<T>
  const errores = ref<Errores>({})
  const errorGeneral = ref<ApiError | null>(null)
  const enviando = ref(false)

  function analizar() {
    const entrada = opciones.preparar ? opciones.preparar(valores.value) : valores.value
    return esquema.safeParse(entrada)
  }

  function erroresDe(issues: z.core.$ZodIssue[]): Errores {
    const r: Errores = {}
    for (const issue of issues) {
      const campo = issue.path.join('.')
      r[campo] ??= issue.message
    }
    return r
  }

  /** Valida todo el formulario. Devuelve los datos ya transformados o null si hay errores. */
  function validar(): z.output<S> | null {
    const r = analizar()
    errores.value = r.success ? {} : erroresDe(r.error.issues)
    return r.success ? r.data : null
  }

  /** Valida un solo campo (al salir de él) sin marcar errores en los que aún no se tocan. */
  function validarCampo(campo: string) {
    const r = analizar()
    const mensaje = r.success ? undefined : erroresDe(r.error.issues)[campo]
    const siguientes = { ...errores.value }
    if (mensaje) siguientes[campo] = mensaje
    else delete siguientes[campo]
    errores.value = siguientes
  }

  function limpiarError(campo: string) {
    if (!(campo in errores.value)) return
    const siguientes = { ...errores.value }
    delete siguientes[campo]
    errores.value = siguientes
  }

  /**
   * Muestra los errores de la API: los de `errors` debajo de su campo; los códigos de
   * `campoPorCodigo` en el campo indicado; el resto como aviso general.
   */
  function aplicarErrorApi(e: ApiError, campoPorCodigo: Record<string, string> = {}) {
    const campo = campoPorCodigo[e.code]
    const llaves = Object.keys(e.errors)
    if (campo) {
      errores.value = { ...errores.value, [campo]: e.detail }
    } else if (llaves.length > 0) {
      const r: Errores = {}
      for (const llave of llaves) {
        const mensaje = e.errors[llave]?.[0]
        if (mensaje) r[llave] = mensaje
      }
      errores.value = r
    } else {
      errorGeneral.value = e
    }
  }

  /**
   * Valida y ejecuta la acción. Si la API responde con error, `alError` puede manejarlo
   * (devuelve true); si no, se pinta con `aplicarErrorApi`.
   */
  async function enviar(
    accion: (datos: z.output<S>) => Promise<void>,
    {
      alError,
      campoPorCodigo,
    }: { alError?: (e: ApiError) => boolean; campoPorCodigo?: Record<string, string> } = {},
  ) {
    if (enviando.value) return
    errorGeneral.value = null
    const datos = validar()
    if (!datos) return
    enviando.value = true
    try {
      await accion(datos)
    } catch (err) {
      const e = comoApiError(err)
      if (!alError?.(e)) aplicarErrorApi(e, campoPorCodigo)
    } finally {
      enviando.value = false
    }
  }

  return {
    valores,
    errores,
    errorGeneral,
    enviando,
    validar,
    validarCampo,
    limpiarError,
    aplicarErrorApi,
    enviar,
  }
}
