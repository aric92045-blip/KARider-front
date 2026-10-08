<script setup lang="ts">
import { computed } from 'vue'
import { mxn } from '@/core/utils/formato'
import BaseInput from '@/shared/components/BaseInput.vue'
import { calcularAporte } from '../../domain/aporte'
import { GASTO_MAXIMO } from '../../domain/esquemas'

const props = defineProps<{ asientos: number; error?: string }>()
const emit = defineEmits<{ validar: [] }>()
const gastoTotal = defineModel<number | string>({ required: true })

const aporte = computed(() => calcularAporte(Number(gastoTotal.value), props.asientos))
</script>

<template>
  <section class="calculadora tarjeta" aria-labelledby="titulo-calculadora">
    <h2 id="titulo-calculadora" class="seccion-titulo">Calculadora de gastos solidarios</h2>
    <div class="calculadora__fila">
      <BaseInput
        v-model="gastoTotal"
        etiqueta="Gasto total (gasolina + casetas)"
        :error="error"
        type="number"
        inputmode="decimal"
        min="0.01"
        :max="GASTO_MAXIMO"
        step="0.01"
        placeholder="$0.00"
        @blur="emit('validar')"
      />
      <div class="calculadora__resultado" aria-live="polite">
        <span class="texto-suave">Aporte por pasajero</span>
        <strong>{{ mxn(aporte) }}</strong>
      </div>
    </div>
    <p class="texto-suave">
      Se divide entre los {{ asientos }} {{ asientos === 1 ? 'asiento' : 'asientos' }} más tu lugar
      como conductor. Conforme al reglamento UTTT, el viaje compartido es sin fines de lucro: solo
      se reparten gastos.
    </p>
  </section>
</template>

<style scoped>
.calculadora {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-3);
}

.calculadora__fila {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--espacio-3);
}

.calculadora__resultado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
  padding: var(--espacio-2) var(--espacio-3);
  border-radius: var(--radio-md);
  background: var(--color-acento-claro);
}

.calculadora__resultado strong {
  font-size: 1.5rem;
  color: var(--color-acento);
}
</style>
