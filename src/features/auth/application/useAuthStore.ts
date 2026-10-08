import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { session } from '@/core/auth/session'
import { refrescarSesion } from '@/core/http/apiClient'
import { authApi } from '../api/authApi'
import type { LoginRequest, UsuarioSesion } from '../domain/tipos'

const CLAVE_USUARIO = 'karider.usuario'

function leerUsuarioGuardado(): UsuarioSesion | null {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO)
    return guardado ? (JSON.parse(guardado) as UsuarioSesion) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<UsuarioSesion | null>(null)
  const autenticado = computed(() => usuario.value !== null)
  const esConductor = computed(
    () => usuario.value?.rol === 'Conductor' || usuario.value?.rol === 'Administrador',
  )

  async function login(datos: LoginRequest) {
    const r = await authApi.login(datos)
    session.guardar(r.accessToken, r.refreshToken, datos.recordarme)
    usuario.value = r.usuario
    // Solo datos de perfil, nunca tokens
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(r.usuario))
  }

  /** Al abrir la app: si hay refresh token, recupera la sesión. */
  async function restaurar() {
    const guardado = leerUsuarioGuardado()
    if (!guardado || !session.getRefreshToken()) return cerrarLocal()
    if (await refrescarSesion()) usuario.value = guardado
    // Sin conexión el refresh token se conserva: se renueva en la siguiente petición.
    else if (session.getRefreshToken()) usuario.value = guardado
    else cerrarLocal()
  }

  async function logout() {
    const refreshToken = session.getRefreshToken()
    if (refreshToken) await authApi.logout(refreshToken).catch(() => {})
    cerrarLocal()
  }

  function cerrarLocal() {
    session.cerrar()
    usuario.value = null
    localStorage.removeItem(CLAVE_USUARIO)
  }

  return { usuario, autenticado, esConductor, login, restaurar, logout, cerrarLocal }
})
