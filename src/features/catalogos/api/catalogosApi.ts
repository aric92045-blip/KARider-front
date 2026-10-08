import { apiClient } from '@/core/http/apiClient'
import type { Carrera, PuntoEncuentro } from '../domain/tipos'

export const catalogosApi = {
  carreras: () => apiClient.get<Carrera[]>('/catalogos/carreras').then((r) => r.data),
  puntosEncuentro: () =>
    apiClient.get<PuntoEncuentro[]>('/catalogos/puntos-encuentro').then((r) => r.data),
}
