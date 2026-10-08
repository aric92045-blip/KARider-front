<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { ApiError } from '@/core/http/apiError'
import AlertMessage from '@/shared/components/AlertMessage.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import { mensajeDeError } from '@/shared/composables/useApiError'
import { useFormulario } from '@/shared/composables/useFormulario'
import { usePublicarViajeStore } from '../../application/usePublicarViajeStore'
import { paso2Esquema } from '../../domain/esquemas'
import CalculadoraAporte from '../components/CalculadoraAporte.vue'
import TarjetaVehiculo from '../components/TarjetaVehiculo.vue'

const MAX_NOTAS = 500
const CAMPOS_PASO_2 = ['gastoTotal', 'notas', 'vehiculoId']
/** Errores que se corrigen en P9 (ruta, horario y capacidad). */
const CODIGOS_PASO_1 = [
  'VIAJE_FECHA_PASADA',
  'VEHICULO_CAPACIDAD_INSUFICIENTE',
  'VIAJE_PUNTO_ENCUENTRO_INVALIDO',
]

const router = useRouter()
const store = usePublicarViajeStore()
const { borrador } = storeToRefs(store)

const { valores, errores, errorGeneral, enviando, enviar, validarCampo } = useFormulario(
  paso2Esquema,
  borrador,
)
const errorPaso1 = ref<ApiError | null>(null)
const accion = ref<'publicar' | 'borrador' | null>(null)

const mensajesPaso1 = computed(() => {
  const e = errorPaso1.value
  if (!e) return []
  const mensajes = Object.values(e.errors).flat()
  return mensajes.length ? mensajes : [e.detail]
})

onMounted(() => {
  // Sin el paso 1 completo no se puede calcular ni publicar
  if (!store.paso1Completo) {
    void router.replace({ name: 'publicar-1' })
    return
  }
  if (!store.vehiculosCargados) void store.cargarVehiculos()
})

function guardar(publicar: boolean) {
  errorPaso1.value = null
  accion.value = publicar ? 'publicar' : 'borrador'
  return enviar(
    async (datos) => {
      const viaje = await store.enviar(datos, publicar)
      await (publicar
        ? router.push({ name: 'viaje', params: { id: viaje.id }, query: { publicado: '1' } })
        : router.push({ name: 'borradores', query: { guardado: '1' } }))
    },
    {
      alError: (e) => {
        const llaves = Object.keys(e.errors)
        const esDelPaso1 =
          CODIGOS_PASO_1.includes(e.code) || llaves.some((k) => !CAMPOS_PASO_2.includes(k))
        if (esDelPaso1) errorPaso1.value = e
        return esDelPaso1
      },
    },
  )
}
</script>

<template>
  <main class="pantalla">
    <header>
      <p class="texto-suave">Paso 2 de 2</p>
      <h1 class="pantalla__titulo">Aporte solidario</h1>
      <p class="pantalla__subtitulo">Calcula cuánto aporta cada pasajero y publica tu viaje.</p>
    </header>

    <form class="formulario" novalidate @submit.prevent="guardar(true)">
      <CalculadoraAporte
        v-model="valores.gastoTotal"
        :asientos="valores.asientos"
        :error="errores.gastoTotal"
        @validar="validarCampo('gastoTotal')"
      />

      <section class="formulario tarjeta" aria-labelledby="titulo-vehiculo">
        <h2 id="titulo-vehiculo" class="seccion-titulo">Vehículo registrado</h2>
        <p v-if="!store.vehiculosCargados && !store.errorVehiculos" class="texto-suave">
          Cargando tu vehículo…
        </p>
        <TarjetaVehiculo
          v-else-if="store.vehiculos.length === 1 && store.vehiculo"
          v-bind="store.vehiculo"
        />
        <fieldset v-else-if="store.vehiculos.length > 1" class="vehiculos">
          <legend class="sr-only">Elige el vehículo del viaje</legend>
          <label
            v-for="v in store.vehiculos"
            :key="v.id"
            class="vehiculos__opcion"
            :class="{ 'vehiculos__opcion--activa': valores.vehiculoId === v.id }"
          >
            <input v-model="valores.vehiculoId" type="radio" :value="v.id" class="sr-only" />
            <TarjetaVehiculo v-bind="v" />
          </label>
        </fieldset>
        <AlertMessage v-else-if="store.vehiculosCargados" tipo="aviso">
          No tienes vehículos activos registrados.
        </AlertMessage>
        <AlertMessage v-if="store.errorVehiculos" tipo="error">
          {{ mensajeDeError(store.errorVehiculos) }}
        </AlertMessage>
      </section>

      <section class="tarjeta notas">
        <label for="notas" class="seccion-titulo">Notas para los pasajeros</label>
        <textarea
          id="notas"
          v-model="valores.notas"
          rows="4"
          :maxlength="MAX_NOTAS"
          placeholder="Ej. Salgo puntual; espero 5 minutos en el punto de encuentro."
          :aria-invalid="!!errores.notas"
        />
        <p class="notas__pie">
          <span v-if="errores.notas" class="notas__error" role="alert">{{ errores.notas }}</span>
          <span class="texto-suave">{{ valores.notas.length }}/{{ MAX_NOTAS }}</span>
        </p>
      </section>

      <AlertMessage v-if="errorPaso1" tipo="error">
        <span v-for="m in mensajesPaso1" :key="m">{{ m }}</span>
        <RouterLink :to="{ name: 'publicar-1' }">Corregir ruta y horario</RouterLink>
      </AlertMessage>
      <AlertMessage v-if="errorGeneral" tipo="error">{{
        mensajeDeError(errorGeneral)
      }}</AlertMessage>

      <BaseButton
        type="submit"
        variante="acento"
        bloque
        :cargando="enviando && accion === 'publicar'"
        :disabled="enviando"
      >
        PUBLICAR RUTA EN CAMPUS UTTT
      </BaseButton>
      <BaseButton
        variante="secundario"
        bloque
        :cargando="enviando && accion === 'borrador'"
        :disabled="enviando"
        @click="guardar(false)"
      >
        Cancelar y guardar borrador
      </BaseButton>
      <RouterLink :to="{ name: 'publicar-1' }" class="centrado">Volver al paso 1</RouterLink>
    </form>
  </main>
</template>

<style scoped>
.vehiculos {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-2);
  margin: 0;
  padding: 0;
  border: 0;
}

.vehiculos__opcion {
  padding: var(--espacio-3);
  border: 2px solid var(--color-borde);
  border-radius: var(--radio-md);
  cursor: pointer;
}

.vehiculos__opcion--activa {
  border-color: var(--color-acento);
  background: var(--color-acento-claro);
}

.vehiculos__opcion:has(input:focus-visible) {
  outline: 3px solid var(--color-acento);
  outline-offset: 2px;
}

.notas {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-2);
}

.notas textarea {
  width: 100%;
  padding: var(--espacio-3);
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-sm);
  resize: vertical;
}

.notas__pie {
  display: flex;
  justify-content: space-between;
  gap: var(--espacio-2);
}

.notas__error {
  font-size: 0.8125rem;
  color: var(--color-error);
}
</style>
