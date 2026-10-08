<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fechaHora, mxn } from '@/core/utils/formato'
import AlertMessage from '@/shared/components/AlertMessage.vue'
import { mensajeDeError } from '@/shared/composables/useApiError'
import { useBorradores } from '../../application/useBorradores'

const route = useRoute()
const { borradores, cargando, error, cargar } = useBorradores()
const guardado = route.query.guardado === '1'

onMounted(cargar)
</script>

<template>
  <main class="pantalla">
    <header>
      <h1 class="pantalla__titulo">Mis borradores</h1>
      <p class="pantalla__subtitulo">
        Los borradores no aparecen en la búsqueda de pasajeros hasta que los publiques.
      </p>
    </header>

    <AlertMessage v-if="guardado" tipo="exito">Tu viaje se guardó como borrador.</AlertMessage>
    <AlertMessage v-if="error" tipo="error">{{ mensajeDeError(error) }}</AlertMessage>
    <p v-if="cargando" class="texto-suave centrado">Cargando…</p>

    <p v-else-if="!error && borradores.length === 0" class="texto-suave centrado">
      No tienes borradores guardados.
    </p>

    <ul class="lista">
      <li v-for="v in borradores" :key="v.id">
        <RouterLink :to="{ name: 'viaje', params: { id: v.id } }" class="tarjeta borrador">
          <strong>{{ v.puntoEncuentro.nombre }} → {{ v.destino }}</strong>
          <span class="texto-suave">{{ fechaHora(v.fechaSalida) }}</span>
          <span
            >{{ v.asientosOfrecidos }} asientos · {{ mxn(v.aportePorAsiento) }} por pasajero</span
          >
        </RouterLink>
      </li>
    </ul>

    <RouterLink :to="{ name: 'publicar-1' }" class="centrado">Publicar una ruta nueva</RouterLink>
  </main>
</template>

<style scoped>
.lista {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.borrador {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: inherit;
  text-decoration: none;
}

.borrador:hover {
  border-color: var(--color-acento);
}
</style>
