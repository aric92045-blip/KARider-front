import { ref } from 'vue'
import { comoApiError, type ApiError } from '@/core/http/apiError'
import { viajesApi } from '../api/viajesApi'
import type { ViajeResumen } from '../domain/tipos'

/** Viajes guardados como borrador por el conductor («Cancelar y guardar borrador» de P10). */
export function useBorradores() {
  const borradores = ref<ViajeResumen[]>([])
  const cargando = ref(false)
  const error = ref<ApiError | null>(null)

  async function cargar() {
    cargando.value = true
    error.value = null
    try {
      borradores.value = (await viajesApi.misPublicados('Borrador')).items
    } catch (e) {
      error.value = comoApiError(e)
    } finally {
      cargando.value = false
    }
  }

  return { borradores, cargando, error, cargar }
}
