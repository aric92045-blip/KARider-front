<script setup lang="ts">
// Se usa con v-bind="vehiculo": los campos extra (id, capacidad) no deben llegar al HTML
defineOptions({ inheritAttrs: false })

defineProps<{
  modelo: string
  color: string
  placas: string
  anio?: number
  verificado: boolean
}>()
</script>

<template>
  <div class="vehiculo">
    <svg class="vehiculo__icono" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 17h14M5 17a2 2 0 104 0M15 17a2 2 0 104 0M3 13l2-6h14l2 6v4H3v-4zM3 13h18" />
    </svg>
    <div class="vehiculo__datos">
      <strong
        >{{ modelo }}<template v-if="anio"> {{ anio }}</template></strong
      >
      <span class="texto-suave">{{ color }} · {{ placas }}</span>
    </div>
    <span v-if="verificado" class="insignia">Verificado</span>
    <span v-else class="insignia insignia--pendiente">Sin verificar</span>
  </div>
</template>

<style scoped>
.vehiculo {
  display: flex;
  align-items: center;
  gap: var(--espacio-3);
}

.vehiculo__icono {
  flex: none;
  width: 40px;
  height: 40px;
  padding: var(--espacio-2);
  border-radius: var(--radio-md);
  background: var(--color-acento-claro);
  fill: none;
  stroke: var(--color-primario);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vehiculo__datos {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.insignia {
  flex: none;
  padding: 2px var(--espacio-2);
  border-radius: var(--radio-pill);
  background: var(--color-exito-claro);
  color: var(--color-exito);
  font-size: 0.75rem;
  font-weight: 700;
}

.insignia--pendiente {
  background: var(--color-aviso-claro);
  color: var(--color-aviso);
}
</style>
