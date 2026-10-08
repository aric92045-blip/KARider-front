import { computed, onScopeDispose, ref } from 'vue'

/** Cuenta regresiva en segundos (ej. «Reenviar código» o el Retry-After de un 429). */
export function useCountdown() {
  const restante = ref(0)
  let intervalo: ReturnType<typeof setInterval> | undefined

  function detener() {
    if (intervalo) clearInterval(intervalo)
    intervalo = undefined
  }

  function iniciar(segundos: number) {
    detener()
    restante.value = Math.max(0, Math.ceil(segundos))
    if (restante.value === 0) return
    intervalo = setInterval(() => {
      restante.value -= 1
      if (restante.value <= 0) detener()
    }, 1000)
  }

  onScopeDispose(detener)

  return { restante, activo: computed(() => restante.value > 0), iniciar, detener }
}
