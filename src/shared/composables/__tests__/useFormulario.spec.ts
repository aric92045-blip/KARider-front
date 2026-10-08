import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ApiError } from '@/core/http/apiError'
import { useFormulario } from '../useFormulario'

const esquema = z.object({
  correo: z.string().min(1, 'Obligatorio'),
  vehiculo: z.object({ placas: z.string().min(5, 'Placas no válidas') }),
})

describe('useFormulario', () => {
  it('pinta los errores de Zod con llaves con punto', () => {
    const f = useFormulario(esquema, { correo: '', vehiculo: { placas: 'X' } })
    expect(f.validar()).toBeNull()
    expect(f.errores.value).toEqual({
      correo: 'Obligatorio',
      'vehiculo.placas': 'Placas no válidas',
    })
  })

  it('muestra los errores de la API debajo de su campo', async () => {
    const f = useFormulario(esquema, { correo: 'a', vehiculo: { placas: 'ABC-123' } })
    await f.enviar(async () => {
      throw new ApiError(400, 'VALIDACION_FALLIDA', 'Datos inválidos', {
        'vehiculo.placas': ['Formato incorrecto'],
      })
    })
    expect(f.errores.value).toEqual({ 'vehiculo.placas': 'Formato incorrecto' })
    expect(f.errorGeneral.value).toBeNull()
  })

  it('lleva un código de negocio a su campo o al aviso general', async () => {
    const f = useFormulario(esquema, { correo: 'a', vehiculo: { placas: 'ABC-123' } })
    const duplicado = new ApiError(409, 'USUARIO_CORREO_DUPLICADO', 'Ya existe una cuenta')
    await f.enviar(() => Promise.reject(duplicado), {
      campoPorCodigo: { USUARIO_CORREO_DUPLICADO: 'correo' },
    })
    expect(f.errores.value.correo).toBe('Ya existe una cuenta')

    const interno = new ApiError(500, 'ERROR_INTERNO', 'Error')
    await f.enviar(() => Promise.reject(interno))
    expect(f.errorGeneral.value).toBe(interno)
  })
})
