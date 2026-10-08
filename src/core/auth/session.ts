const CLAVE = 'karider.rt'

/** El access token vive solo en memoria; el refresh token en localStorage («recordarme») o sessionStorage. */
let accessToken: string | null = null

export const session = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => localStorage.getItem(CLAVE) ?? sessionStorage.getItem(CLAVE),
  guardar(access: string, refresh: string, recordarme: boolean) {
    accessToken = access
    this.limpiarRefresh()
    ;(recordarme ? localStorage : sessionStorage).setItem(CLAVE, refresh)
  },
  recordarme: () => localStorage.getItem(CLAVE) !== null,
  limpiarRefresh() {
    localStorage.removeItem(CLAVE)
    sessionStorage.removeItem(CLAVE)
  },
  cerrar() {
    accessToken = null
    this.limpiarRefresh()
  },
}
