<script setup lang="ts">
defineProps<{ capacidad: number; error?: string }>()
const asientos = defineModel<number>({ required: true })
</script>

<template>
  <fieldset class="asientos">
    <legend class="asientos__etiqueta">Asientos disponibles</legend>
    <div class="asientos__opciones">
      <label
        v-for="n in 4"
        :key="n"
        class="asientos__opcion"
        :class="{
          'asientos__opcion--activa': asientos === n,
          'asientos__opcion--inactiva': n > capacidad,
        }"
      >
        <input
          v-model="asientos"
          type="radio"
          name="asientos"
          :value="n"
          :disabled="n > capacidad"
          class="sr-only"
        />
        {{ n }}
      </label>
    </div>
    <p v-if="error" class="asientos__error" role="alert">{{ error }}</p>
    <p v-else-if="capacidad < 4" class="texto-suave">
      Tu vehículo admite hasta {{ capacidad }} {{ capacidad === 1 ? 'pasajero' : 'pasajeros' }}.
    </p>
  </fieldset>
</template>

<style scoped>
.asientos {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-2);
  margin: 0;
  padding: 0;
  border: 0;
}

.asientos__etiqueta {
  margin-bottom: var(--espacio-2);
  font-size: 0.875rem;
  font-weight: 600;
}

.asientos__opciones {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--espacio-2);
}

.asientos__opcion {
  display: grid;
  place-items: center;
  min-height: 52px;
  border: 2px solid var(--color-borde);
  border-radius: var(--radio-md);
  background: var(--color-superficie);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
}

.asientos__opcion--activa {
  border-color: var(--color-primario);
  background: var(--color-primario);
  color: #fff;
}

.asientos__opcion--inactiva {
  cursor: not-allowed;
  opacity: 0.35;
}

.asientos__opcion:has(input:focus-visible) {
  outline: 3px solid var(--color-acento);
  outline-offset: 2px;
}

.asientos__error {
  font-size: 0.8125rem;
  color: var(--color-error);
}
</style>
