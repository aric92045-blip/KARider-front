# KARider-front

Aplicación web progresiva para coordinar viajes compartidos entre miembros de la misma universidad.

PWA en **Vue 3 + TypeScript + Vite** que consume la API `KARider-back`. Sprint 1: HU-01 a HU-05.

## Requisitos

- Node.js 22 LTS (≥ 22.18) y npm

## Arranque local

```bash
npm install
cp .env.example .env.development   # apunta a la API local (http://localhost:5014)
npm run dev
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run test:unit` | Pruebas con Vitest (modo observador) |
| `npm run test:ci` | Pruebas una sola vez (CI) |
| `npm run lint` | oxlint + ESLint |
| `npm run build` | Type-check y compilación a `dist/` |

## Variables de entorno

Todo lo que empieza con `VITE_` termina en el JavaScript del navegador: **solo datos públicos**.
Los `.env` reales no se suben; la plantilla es `.env.example`. La configuración se valida al
arrancar en `src/core/config/env.ts`. En producción, `VITE_API_BASE_URL` se define en el workflow
de Azure Static Web Apps.

## Estructura

```
src/
├── app/        arranque, App.vue, router y guards
├── core/       config, cliente HTTP, errores de la API, sesión, utilidades
├── shared/     componentes base, composables y estilos
└── features/
    ├── catalogos/   carreras y puntos de encuentro
    ├── auth/        HU-01, HU-02, HU-03 (P1, P2, P3/P4, verificar correo, recuperar contraseña)
    └── viajes/      HU-04, HU-05 (P9, P10, P11, borradores)
```

Cada feature se divide en `domain/` (TypeScript puro), `api/` (una función por endpoint),
`application/` (stores y casos de uso) y `ui/` (vistas y componentes).

## Seguridad

- El access token vive solo en memoria; el refresh token en `localStorage` («Recordar mis
  credenciales») o `sessionStorage`. Se rota en cada renovación.
- Nunca se usa `v-html` con datos del usuario ni se registran tokens o contraseñas.
- Las cabeceras CSP y de seguridad para Azure están en `public/staticwebapp.config.json`.
