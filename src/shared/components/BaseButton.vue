<script setup lang="ts">
withDefaults(
  defineProps<{
    variante?: 'primario' | 'secundario' | 'acento' | 'texto'
    type?: 'button' | 'submit'
    cargando?: boolean
    disabled?: boolean
    bloque?: boolean
  }>(),
  { variante: 'primario', type: 'button', cargando: false, disabled: false, bloque: false },
)
</script>

<template>
  <button
    :type="type"
    class="boton"
    :class="[`boton--${variante}`, { 'boton--bloque': bloque }]"
    :disabled="disabled || cargando"
    :aria-busy="cargando"
  >
    <span v-if="cargando" class="boton__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--espacio-2);
  min-height: 48px;
  padding: 0 var(--espacio-5);
  border: 2px solid transparent;
  border-radius: var(--radio-md);
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background-color 0.15s,
    opacity 0.15s;
}

.boton:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.boton--bloque {
  width: 100%;
}

.boton--primario {
  background: var(--color-primario);
  color: #fff;
}

.boton--primario:not(:disabled):hover {
  background: var(--color-primario-claro);
}

.boton--acento {
  background: var(--color-acento);
  color: #fff;
}

.boton--secundario {
  background: var(--color-superficie);
  border-color: var(--color-primario);
  color: var(--color-primario);
}

.boton--texto {
  min-height: 40px;
  padding: 0 var(--espacio-2);
  background: transparent;
  color: var(--color-acento);
}

.boton__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>
