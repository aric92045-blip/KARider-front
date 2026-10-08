import { defineStore } from 'pinia'
import { ref } from 'vue'
import { comoApiError, type ApiError } from '@/core/http/apiError'
import { catalogosApi } from '../api/catalogosApi'
import type { Carrera, PuntoEncuentro } from '../domain/tipos'

/** Catálogos fijos: se piden una sola vez por sesión de la app. */
export const useCatalogosStore = defineStore('catalogos', () => {
  const carreras = ref<Carrera[]>([])
  const puntosEncuentro = ref<PuntoEncuentro[]>([])
  const error = ref<ApiError | null>(null)
  const cargando = ref(false)

  async function cargar<T>(destino: { value: T[] }, pedir: () => Promise<T[]>) {
    if (destino.value.length > 0) return
    cargando.value = true
    error.value = null
    try {
      destino.value = await pedir()
    } catch (e) {
      error.value = comoApiError(e)
    } finally {
      cargando.value = false
    }
  }

  const cargarCarreras = () => cargar(carreras, catalogosApi.carreras)
  const cargarPuntosEncuentro = () => cargar(puntosEncuentro, catalogosApi.puntosEncuentro)

  return { carreras, puntosEncuentro, error, cargando, cargarCarreras, cargarPuntosEncuentro }
})
