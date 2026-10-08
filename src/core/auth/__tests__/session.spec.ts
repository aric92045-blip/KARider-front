import { beforeEach, describe, expect, it } from 'vitest'
import { session } from '../session'

describe('session (HU-03)', () => {
  beforeEach(() => {
    session.cerrar()
  })

  it('con «recordar» guarda el refresh token en localStorage', () => {
    session.guardar('access', 'refresh', true)
    expect(localStorage.getItem('karider.rt')).toBe('refresh')
    expect(sessionStorage.getItem('karider.rt')).toBeNull()
    expect(session.recordarme()).toBe(true)
  })

  it('sin «recordar» lo guarda en sessionStorage', () => {
    session.guardar('access', 'refresh', false)
    expect(sessionStorage.getItem('karider.rt')).toBe('refresh')
    expect(localStorage.getItem('karider.rt')).toBeNull()
    expect(session.recordarme()).toBe(false)
  })

  it('el access token vive solo en memoria', () => {
    session.guardar('access', 'refresh', true)
    expect(session.getAccessToken()).toBe('access')
    expect(JSON.stringify({ ...localStorage, ...sessionStorage })).not.toContain('access')
  })

  it('al rotar el refresh token descarta el anterior', () => {
    session.guardar('a1', 'r1', true)
    session.guardar('a2', 'r2', false)
    expect(localStorage.getItem('karider.rt')).toBeNull()
    expect(session.getRefreshToken()).toBe('r2')
  })

  it('cerrar() limpia ambos almacenamientos y la memoria', () => {
    session.guardar('access', 'refresh', true)
    sessionStorage.setItem('karider.rt', 'otro')
    session.cerrar()
    expect(session.getAccessToken()).toBeNull()
    expect(session.getRefreshToken()).toBeNull()
  })
})
