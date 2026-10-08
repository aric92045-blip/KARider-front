import { apiClient } from '@/core/http/apiClient'
import type {
  EstadoViaje,
  PagedResult,
  PublicarViajeRequest,
  Vehiculo,
  ViajeDetalle,
  ViajeResumen,
} from '../domain/tipos'

export const viajesApi = {
  misVehiculos: () => apiClient.get<Vehiculo[]>('/vehiculos').then((r) => r.data),
  publicar: (p: PublicarViajeRequest) =>
    apiClient.post<ViajeDetalle>('/viajes', p).then((r) => r.data),
  publicarBorrador: (id: string) =>
    apiClient
      .patch<ViajeDetalle>(`/viajes/${encodeURIComponent(id)}/estado`, { estado: 'Programado' })
      .then((r) => r.data),
  misPublicados: (estado?: EstadoViaje, pagina = 1) =>
    apiClient
      .get<PagedResult<ViajeResumen>>('/viajes/publicados', { params: { estado, pagina } })
      .then((r) => r.data),
  detalle: (id: string) =>
    apiClient.get<ViajeDetalle>(`/viajes/${encodeURIComponent(id)}`).then((r) => r.data),
}
