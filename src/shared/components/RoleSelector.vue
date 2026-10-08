<script setup lang="ts">
type RolSeleccionable = 'Pasajero' | 'Conductor'

defineProps<{ etiqueta?: string }>()
const modelo = defineModel<RolSeleccionable>({ required: true })

const opciones: { valor: RolSeleccionable; texto: string }[] = [
  { valor: 'Pasajero', texto: 'Pasajero UTTT' },
  { valor: 'Conductor', texto: 'Conductor UTTT' },
]
</script>

<template>
  <fieldset class="roles">
    <legend class="sr-only">{{ etiqueta ?? 'Selecciona tu rol' }}</legend>
    <label
      v-for="o in opciones"
      :key="o.valor"
      class="roles__opcion"
      :class="{ 'roles__opcion--activa': modelo === o.valor }"
    >
      <input v-model="modelo" type="radio" name="rol" :value="o.valor" class="sr-only" />
      {{ o.texto }}
    </label>
  </fieldset>
</template>

<style scoped>
.roles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacio-1);
  margin: 0;
  padding: var(--espacio-1);
  border: 0;
  border-radius: var(--radio-pill);
  background: #e6ebf2;
}

.roles__opcion {
  display: grid;
  place-items: center;
  min-height: 44px;
  border-radius: var(--radio-pill);
  font-weight: 600;
  color: var(--color-texto-suave);
  cursor: pointer;
}

.roles__opcion--activa {
  background: var(--color-primario);
  color: #fff;
  box-shadow: var(--sombra-sm);
}

.roles__opcion:has(input:focus-visible) {
  outline: 3px solid var(--color-acento);
  outline-offset: 2px;
}
</style>
