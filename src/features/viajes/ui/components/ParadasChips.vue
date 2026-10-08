<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { MAX_PARADAS, paradaEsquema } from '../../domain/esquemas'

defineProps<{ error?: string }>()
const paradas = defineModel<string[]>({ required: true })

const id = useId()
const nueva = ref('')
const errorLocal = ref('')
const llena = computed(() => paradas.value.length >= MAX_PARADAS)

function agregar() {
  const r = paradaEsquema.safeParse(nueva.value)
  if (!r.success) {
    errorLocal.value = r.error.issues[0]?.message ?? 'Parada no válida'
    return
  }
  if (llena.value) return
  paradas.value = [...paradas.value, r.data]
  nueva.value = ''
  errorLocal.value = ''
}

function quitar(indice: number) {
  paradas.value = paradas.value.filter((_, i) => i !== indice)
}
</script>

<template>
  <div class="paradas">
    <label :for="id" class="paradas__etiqueta">
      Paradas intermedias (opcional, máximo {{ MAX_PARADAS }})
    </label>
    <div class="paradas__agregar">
      <input
        :id="id"
        v-model="nueva"
        class="paradas__input"
        maxlength="100"
        :disabled="llena"
        :placeholder="llena ? 'Llegaste al máximo de paradas' : 'Ej. Plaza Galerías'"
        @keydown.enter.prevent="agregar"
      />
      <button
        type="button"
        class="paradas__mas"
        aria-label="Agregar parada"
        :disabled="llena"
        @click="agregar"
      >
        +
      </button>
    </div>
    <ul v-if="paradas.length" class="paradas__lista">
      <li v-for="(p, i) in paradas" :key="`${i}-${p}`" class="chip">
        <span>{{ p }}</span>
        <button type="button" class="chip__quitar" :aria-label="`Quitar ${p}`" @click="quitar(i)">
          ×
        </button>
      </li>
    </ul>
    <p v-if="errorLocal || error" class="paradas__error" role="alert">{{ errorLocal || error }}</p>
  </div>
</template>

<style scoped>
.paradas {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-2);
}

.paradas__etiqueta {
  font-size: 0.875rem;
  font-weight: 600;
}

.paradas__agregar {
  display: flex;
  gap: var(--espacio-2);
}

.paradas__input {
  flex: 1;
  min-width: 0;
  min-height: 48px;
  padding: 0 var(--espacio-3);
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-sm);
  background: var(--color-superficie);
}

.paradas__mas {
  width: 48px;
  border: 0;
  border-radius: var(--radio-sm);
  background: var(--color-acento);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.paradas__mas:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.paradas__lista {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacio-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--espacio-1);
  max-width: 100%;
  padding: var(--espacio-1) var(--espacio-1) var(--espacio-1) var(--espacio-3);
  border-radius: var(--radio-pill);
  background: var(--color-acento-claro);
  color: var(--color-primario);
  font-size: 0.875rem;
  font-weight: 600;
}

.chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip__quitar {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 1.125rem;
  cursor: pointer;
}

.paradas__error {
  font-size: 0.8125rem;
  color: var(--color-error);
}
</style>
