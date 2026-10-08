import { env } from '@/core/config/env'

const moneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export const mxn = (v: number) => moneda.format(v)

export const fechaHora = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: env.zonaHoraria,
  }).format(new Date(iso))
