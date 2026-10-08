import { apiClient } from '@/core/http/apiClient'
import type {
  AuthResponse,
  LoginRequest,
  MensajeResponse,
  RegistroRequest,
  RegistroResponse,
  RestablecerPasswordRequest,
} from '../domain/tipos'

export const authApi = {
  registro: (datos: RegistroRequest) =>
    apiClient.post<RegistroResponse>('/auth/registro', datos).then((r) => r.data),
  verificarCorreo: (correoInstitucional: string, codigo: string) =>
    apiClient
      .post<MensajeResponse>('/auth/verificar-correo', { correoInstitucional, codigo })
      .then((r) => r.data),
  reenviarCodigo: (correoInstitucional: string) =>
    apiClient
      .post<MensajeResponse>('/auth/reenviar-codigo', { correoInstitucional })
      .then((r) => r.data),
  login: (datos: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', datos).then((r) => r.data),
  logout: (refreshToken: string) => apiClient.post<void>('/auth/logout', { refreshToken }),
  olvideContrasena: (correoInstitucional: string) =>
    apiClient
      .post<MensajeResponse>('/auth/olvide-contrasena', { correoInstitucional })
      .then((r) => r.data),
  restablecerContrasena: (datos: RestablecerPasswordRequest) =>
    apiClient.post<MensajeResponse>('/auth/restablecer-contrasena', datos).then((r) => r.data),
}
