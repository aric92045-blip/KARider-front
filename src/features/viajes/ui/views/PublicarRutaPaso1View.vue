<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { aFechaInput, sumarDias } from '@/core/utils/fechas'
import AlertMessage from '@/shared/components/AlertMessage.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseSelect from '@/shared/components/BaseSelect.vue'
import { mensajeDeError } from '@/shared/composables/useApiError'
import { useFormulario } from '@/shared/composables/useFormulario'
import { useCatalogosStore } from '@/features/catalogos/application/useCatalogosStore'
import { usePublicarViajeStore } from '../../application/usePublicarViajeStore'
import { DIAS_MAX_ANTICIPACION, paso1Esquema } from '../../domain/esquemas'
import ParadasChips from '../components/ParadasChips.vue'
import SelectorAsientos from '../components/SelectorAsientos.vue'

const router = useRouter()
const catalogos = useCatalogosStore()
const store = usePublicarViajeStore()
const { borrador } = storeToRefs(store)

const { valores, errores, validar, validarCampo } = useFormulario(paso1Esquema, borrador)

const hoy = new Date()
const fechaMin = aFechaInput(hoy)
const fechaMax = aFechaInput(sumarDias(hoy, DIAS_MAX_ANTICIPACION))

const opcionesPunto = computed(() =>
  catalogos.puntosEncuentro.map((p) => ({ valor: p.id, texto: p.nombre })),
)
const puntoSeleccionado = computed(() =>
  catalogos.puntosEncuentro.find((p) => p.id === Number(valores.value.puntoEncuentroId)),
)
const sinVehiculo = computed(() => store.vehiculosCargados && store.vehiculos.length === 0)

onMounted(() => {
  void catalogos.cargarPuntosEncuentro()
  void store.cargarVehiculos()
})

function continuar() {
  if (validar()) void router.push({ name: 'publicar-2' })
}
</script>

<template>
  <main class="pantalla">
    <header>
      <p class="texto-suave">Paso 1 de 2</p>
      <h1 class="pantalla__titulo">Publicar ruta</h1>
      <p class="pantalla__subtitulo">
        Indica de dónde sales, a dónde vas y cuántos lugares ofreces.
      </p>
    </header>

    <AlertMessage v-if="sinVehiculo" tipo="aviso">
      Aún no tienes un vehículo registrado. Necesitas uno activo para publicar viajes.
    </AlertMessage>
    <AlertMessage v-if="store.errorVehiculos" tipo="error">
      {{ mensajeDeError(store.errorVehiculos) }}
    </AlertMessage>
    <AlertMessage v-if="catalogos.error" tipo="error">
      No pudimos cargar los puntos de encuentro. {{ mensajeDeError(catalogos.error) }}
    </AlertMessage>

    <form class="formulario" novalidate @submit.prevent="continuar">
      <section class="formulario tarjeta" aria-label="Ruta">
        <BaseSelect
          v-model="valores.puntoEncuentroId"
          etiqueta="Punto de encuentro en el campus"
          placeholder="Selecciona el punto de encuentro"
          :opciones="opcionesPunto"
          :error="errores.puntoEncuentroId"
          :ayuda="puntoSeleccionado?.descripcion"
          @change="validarCampo('puntoEncuentroId')"
        />
        <BaseInput
          v-model="valores.destino"
          etiqueta="Destino final"
          :error="errores.destino"
          maxlength="150"
          placeholder="Ej. Centro de Tula"
          @blur="validarCampo('destino')"
        />
        <ParadasChips v-model="valores.paradas" :error="errores.paradas" />
      </section>

      <section class="formulario tarjeta" aria-label="Horario y capacidad">
        <div class="fila">
          <BaseInput
            v-model="valores.fecha"
            etiqueta="Fecha"
            type="date"
            :min="fechaMin"
            :max="fechaMax"
            :error="errores.fecha"
          />
          <BaseInput
            v-model="valores.hora"
            etiqueta="Hora de salida"
            type="time"
            :error="errores.hora"
          />
        </div>
        <SelectorAsientos
          v-model="valores.asientos"
          :capacidad="store.capacidad"
          :error="errores.asientos"
        />
      </section>

      <BaseButton type="submit" bloque :disabled="sinVehiculo">CONTINUAR</BaseButton>
    </form>
  </main>
</template>
