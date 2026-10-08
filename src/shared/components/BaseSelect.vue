<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  etiqueta: string
  opciones: { valor: string | number; texto: string }[]
  placeholder?: string
  error?: string
  ayuda?: string
}>()

const modelo = defineModel<string | number>({ default: '' })
const id = useId()
</script>

<template>
  <div class="campo" :class="{ 'campo--error': error }">
    <label class="campo__etiqueta" :for="id">{{ etiqueta }}</label>
    <select
      :id="id"
      v-model="modelo"
      class="campo__select"
      :aria-invalid="!!error"
      :aria-describedby="error || ayuda ? `${id}-msg` : undefined"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="o in opciones" :key="o.valor" :value="o.valor">{{ o.texto }}</option>
    </select>
    <p v-if="error" :id="`${id}-msg`" class="campo__error" role="alert">{{ error }}</p>
    <p v-else-if="ayuda" :id="`${id}-msg`" class="campo__ayuda">{{ ayuda }}</p>
  </div>
</template>

<style scoped>
.campo {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-1);
}

.campo__etiqueta {
  font-size: 0.875rem;
  font-weight: 600;
}

.campo__select {
  width: 100%;
  min-height: 48px;
  padding: 0 var(--espacio-3);
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-sm);
  background: var(--color-superficie);
}

.campo__select:focus {
  border-color: var(--color-acento);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-acento-claro);
}

.campo--error .campo__select {
  border-color: var(--color-error);
}

.campo__error {
  font-size: 0.8125rem;
  color: var(--color-error);
}

.campo__ayuda {
  font-size: 0.8125rem;
  color: var(--color-texto-suave);
}
</style>
