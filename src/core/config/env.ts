import { z } from 'zod'

const esquema = z.object({
  VITE_API_BASE_URL: z.url().refine((u) => !u.endsWith('/'), 'Sin "/" al final'),
  VITE_APP_NOMBRE: z.string().default('KARider'),
  VITE_DOMINIO_INSTITUCIONAL: z.string().default('uttt.edu.mx'),
  VITE_ZONA_HORARIA: z.string().default('America/Mexico_City'),
})

const resultado = esquema.safeParse(import.meta.env)
if (!resultado.success) {
  // Falla rápido y claro en lugar de hacer peticiones a "undefined/api/v1/…"
  throw new Error(
    `Configuración inválida: ${resultado.error.issues.map((i) => i.path.join('.')).join(', ')}`,
  )
}

export const env = {
  apiUrl: `${resultado.data.VITE_API_BASE_URL}/api/v1`,
  appNombre: resultado.data.VITE_APP_NOMBRE,
  dominio: resultado.data.VITE_DOMINIO_INSTITUCIONAL,
  zonaHoraria: resultado.data.VITE_ZONA_HORARIA,
} as const
