<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ error?: string }>()
const codigo = defineModel<string>({ default: '' })
const id = useId()

function alEscribir(evento: Event) {
  const input = evento.target as HTMLInputElement
  // Solo dígitos, máximo 6 (también al pegar el código del correo)
  const limpio = input.value.replace(/\D/g, '').slice(0, 6)
  input.value = limpio
  codigo.value = limpio
}
</script>

<template>
  <div class="codigo" :class="{ 'codigo--error': error }">
    <label :for="id" class="codigo__etiqueta">Código de verificación</label>
    <input
      :id="id"
      class="codigo__input"
      :value="codigo"
      inputmode="numeric"
      autocomplete="one-time-code"
      pattern="\d{6}"
      maxlength="6"
      placeholder="••••••"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-msg` : undefined"
      @input="alEscribir"
    />
    <p v-if="error" :id="`${id}-msg`" class="codigo__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.codigo {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-1);
}

.codigo__etiqueta {
  font-size: 0.875rem;
  font-weight: 600;
}

.codigo__input {
  min-height: 64px;
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-md);
  background: var(--color-superficie);
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5em;
  text-align: center;
  text-indent: 0.5em;
}

.codigo__input:focus {
  border-color: var(--color-acento);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-acento-claro);
}

.codigo--error .codigo__input {
  border-color: var(--color-error);
}

.codigo__error {
  font-size: 0.8125rem;
  color: var(--color-error);
}
</style>
