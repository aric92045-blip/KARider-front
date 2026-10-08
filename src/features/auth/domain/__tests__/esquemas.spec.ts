import { describe, expect, it } from 'vitest'
import { registroEsquema } from '../esquemas'

const pasajero = {
  rol: 'Pasajero',
  nombreCompleto: 'Kazumi Barrera',
  matricula: '2023123456',
  telefono: '773 123 4567',
  carreraId: 1,
  correoInstitucional: '2023123456@uttt.edu.mx',
  password: 'Segura#2026',
  confirmarPassword: 'Segura#2026',
}

const vehiculo = {
  modelo: 'Nissan Versa',
  color: 'Gris',
  anio: 2019,
  placas: 'HNX-421-C',
  capacidad: 4,
}

function erroresDe(datos: unknown) {
  const r = registroEsquema.safeParse(datos)
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'))
}

describe('registroEsquema (HU-01 / HU-02)', () => {
  it('acepta un pasajero válido y un conductor con vehículo', () => {
    expect(erroresDe(pasajero)).toEqual([])
    expect(erroresDe({ ...pasajero, rol: 'Conductor', vehiculo })).toEqual([])
  })

  it('rechaza correos que no son @uttt.edu.mx', () => {
    expect(erroresDe({ ...pasajero, correoInstitucional: 'kazumi@gmail.com' })).toContain(
      'correoInstitucional',
    )
  })

  it('rechaza una contraseña débil', () => {
    const debil = 'abcdefgh'
    expect(erroresDe({ ...pasajero, password: debil, confirmarPassword: debil })).toContain(
      'password',
    )
  })

  it('rechaza una confirmación distinta', () => {
    expect(erroresDe({ ...pasajero, confirmarPassword: 'Otra#2026' })).toContain(
      'confirmarPassword',
    )
  })

  it('rechaza un conductor sin vehículo', () => {
    expect(erroresDe({ ...pasajero, rol: 'Conductor' })).toContain('vehiculo')
  })

  it('valida los datos anidados del vehículo con llaves con punto', () => {
    expect(
      erroresDe({
        ...pasajero,
        rol: 'Conductor',
        vehiculo: { ...vehiculo, placas: 'X', capacidad: 5 },
      }),
    ).toEqual(expect.arrayContaining(['vehiculo.placas', 'vehiculo.capacidad']))
  })

  it('trata el cuatrimestre vacío como opcional', () => {
    expect(erroresDe({ ...pasajero, cuatrimestre: '' })).toEqual([])
    expect(erroresDe({ ...pasajero, cuatrimestre: 12 })).toContain('cuatrimestre')
  })
})
