import { describe, expect, it } from 'vitest'
import { calcularAporte } from '../aporte'

describe('calcularAporte (HU-05)', () => {
  it('divide el gasto entre los asientos más el conductor', () => {
    expect(calcularAporte(160, 3)).toBe(40)
  })

  it('redondea a 2 decimales como la API', () => {
    expect(calcularAporte(100, 2)).toBe(33.33)
    expect(calcularAporte(0.05, 1)).toBe(0.03) // AwayFromZero
  })

  it('devuelve 0 si aún no hay datos válidos', () => {
    expect(calcularAporte(0, 3)).toBe(0)
    expect(calcularAporte(160, 0)).toBe(0)
    expect(calcularAporte(Number.NaN, 3)).toBe(0)
  })
})
