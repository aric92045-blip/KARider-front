<script setup lang="ts">
withDefaults(defineProps<{ tipo?: 'error' | 'exito' | 'info' | 'aviso' }>(), { tipo: 'info' })
</script>

<template>
  <div class="alerta" :class="`alerta--${tipo}`" :role="tipo === 'error' ? 'alert' : 'status'">
    <slot />
  </div>
</template>

<style scoped>
.alerta {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-2);
  padding: var(--espacio-3) var(--espacio-4);
  border-radius: var(--radio-sm);
  border-left: 4px solid;
  font-size: 0.9375rem;
}

.alerta--error {
  background: var(--color-error-claro);
  border-color: var(--color-error);
  color: var(--color-error);
}

.alerta--exito {
  background: var(--color-exito-claro);
  border-color: var(--color-exito);
  color: var(--color-exito);
}

.alerta--info {
  background: var(--color-acento-claro);
  border-color: var(--color-acento);
  color: var(--color-primario);
}

.alerta--aviso {
  background: var(--color-aviso-claro);
  border-color: var(--color-aviso);
  color: var(--color-aviso);
}
</style>
