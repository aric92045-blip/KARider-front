import { authApi } from '../api/authApi'
import type { RegistroForm } from '../domain/esquemas'
import type { RestablecerPasswordRequest } from '../domain/tipos'

/** Casos de uso de cuenta que no cambian la sesión: registro, verificación y recuperación. */
export const cuenta = {
  /** HU-01 / HU-02. El vehículo solo se envía si el rol es Conductor. */
  registrar: (datos: RegistroForm) =>
    authApi.registro({
      ...datos,
      vehiculo:
        datos.rol === 'Conductor' && datos.vehiculo
          ? { ...datos.vehiculo, placas: datos.vehiculo.placas.toUpperCase() }
          : undefined,
    }),
  verificarCorreo: authApi.verificarCorreo,
  reenviarCodigo: authApi.reenviarCodigo,
  olvideContrasena: authApi.olvideContrasena,
  restablecerContrasena: (datos: RestablecerPasswordRequest) =>
    authApi.restablecerContrasena(datos),
}

/** Códigos de la API que se pintan debajo de un campo del formulario de registro. */
export const campoPorCodigoRegistro: Record<string, string> = {
  USUARIO_CORREO_DUPLICADO: 'correoInstitucional',
  USUARIO_MATRICULA_DUPLICADA: 'matricula',
  USUARIO_CARRERA_INVALIDA: 'carreraId',
  VEHICULO_PLACAS_DUPLICADAS: 'vehiculo.placas',
  VEHICULO_REQUERIDO_CONDUCTOR: 'vehiculo',
}

/** Códigos que se pintan en el input del código de verificación. */
export const CODIGOS_ERROR_VERIFICACION = [
  'AUTH_CODIGO_INVALIDO',
  'AUTH_CODIGO_EXPIRADO',
  'AUTH_CODIGO_INTENTOS_EXCEDIDOS',
]
