export type Rol = 'Pasajero' | 'Conductor' | 'Administrador'
export type RolIngreso = Exclude<Rol, 'Administrador'>

export interface UsuarioSesion {
  id: string
  nombreCompleto: string
  correoInstitucional: string
  rol: Rol
  fotoUrl: string | null
}

export interface AuthResponse {
  accessToken: string
  accessTokenExpiraEn: string
  refreshToken: string
  refreshTokenExpiraEn: string
  tokenType: 'Bearer'
  usuario: UsuarioSesion
}

export interface VehiculoRequest {
  modelo: string
  color: string
  anio: number
  placas: string
  capacidad: number
}

export interface RegistroRequest {
  rol: RolIngreso
  nombreCompleto: string
  matricula: string
  telefono: string
  carreraId: number
  cuatrimestre?: number
  correoInstitucional: string
  password: string
  confirmarPassword: string
  vehiculo?: VehiculoRequest
}

export interface RegistroResponse {
  usuarioId: string
  correoInstitucional: string
  codigoExpiraEn: string
  mensaje: string
}

export interface LoginRequest {
  correoInstitucional: string
  password: string
  rol?: RolIngreso
  recordarme: boolean
}

export interface RestablecerPasswordRequest {
  correoInstitucional: string
  codigo: string
  nuevaPassword: string
  confirmarPassword: string
}

export interface MensajeResponse {
  mensaje: string
}
