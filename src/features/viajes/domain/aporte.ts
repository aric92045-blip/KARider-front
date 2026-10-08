/**
 * Misma regla que la API: el gasto se divide entre los asientos ofrecidos MÁS el conductor.
 * Ej. $160 con 3 asientos → 160 / 4 = $40 por asiento. Es solo una vista previa:
 * el valor oficial es el `aportePorAsiento` que devuelve la API.
 */
export function calcularAporte(gastoTotal: number, asientos: number): number {
  if (!Number.isFinite(gastoTotal) || asientos < 1 || gastoTotal <= 0) return 0
  return Math.round((gastoTotal / (asientos + 1) + Number.EPSILON) * 100) / 100
}
