```vue
<script setup lang="ts">
// Importa computed para crear un valor calculado que se actualiza
// automáticamente cuando cambian sus dependencias.
import { computed } from 'vue'

// Importa la función mxn, que permite mostrar cantidades en formato
// de moneda mexicana (pesos mexicanos).
import { mxn } from '@/core/utils/formato'

// Importa el componente reutilizable BaseInput para capturar el gasto total.
import BaseInput from '@/shared/components/BaseInput.vue'

// Importa la función que calcula el aporte económico por pasajero.
import { calcularAporte } from '../../domain/aporte'

// Importa la constante que establece el gasto máximo permitido.
import { GASTO_MAXIMO } from '../../domain/esquemas'


// Define las propiedades que este componente recibe desde el componente padre.
// asientos: número de asientos disponibles para pasajeros.
// error: mensaje opcional que se muestra si existe un error de validación.
const props = defineProps<{
  asientos: number
  error?: string
}>()


// Define el evento "validar", que permite avisar al componente padre
// cuando se necesita validar el gasto ingresado.
const emit = defineEmits<{
  validar: []
}>()


// Crea un modelo vinculado con el componente padre mediante v-model.
// Permite leer y modificar el gasto total desde ambos componentes.
// Acepta un número o una cadena porque los campos numéricos pueden
// entregar temporalmente su valor como texto.
const gastoTotal = defineModel<number | string>({ required: true })


// Calcula el aporte económico por pasajero.
// Convierte el gasto total a número y lo divide según la lógica
// definida en calcularAporte, considerando también los asientos.
// El resultado se actualiza automáticamente si cambia el gasto
// o el número de asientos.
const aporte = computed(() =>
  calcularAporte(Number(gastoTotal.value), props.asientos)
)
</script>

<template>
  <!-- Sección principal de la calculadora de gastos solidarios.
       aria-labelledby relaciona esta sección con su título para
       mejorar la accesibilidad. -->
  <section
    class="calculadora tarjeta"
    aria-labelledby="titulo-calculadora"
  >

    <!-- Título visible de la calculadora. -->
    <h2
      id="titulo-calculadora"
      class="seccion-titulo"
    >
      Calculadora de gastos solidarios
    </h2>

    <!-- Contenedor que agrupa el campo de gasto y el resultado calculado. -->
    <div class="calculadora__fila">

      <!-- Campo reutilizable para capturar el gasto total del viaje.
           v-model mantiene sincronizado el valor con gastoTotal.
           :error muestra el mensaje de error recibido del padre.
           type="number" permite ingresar cantidades numéricas.
           inputmode="decimal" sugiere un teclado decimal en dispositivos móviles.
           min establece el gasto mínimo permitido.
           :max limita el valor al máximo definido en GASTO_MAXIMO.
           step="0.01" permite ingresar cantidades con dos decimales.
           @blur solicita la validación cuando el campo pierde el foco. -->
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

      <!-- Muestra el resultado del cálculo.
           aria-live="polite" permite que los lectores de pantalla
           anuncien los cambios del resultado sin interrumpir al usuario. -->
      <div
        class="calculadora__resultado"
        aria-live="polite"
      >

        <!-- Etiqueta descriptiva del resultado. -->
        <span class="texto-suave">
          Aporte por pasajero
        </span>

        <!-- Muestra el aporte calculado con formato de pesos mexicanos. -->
        <strong>{{ mxn(aporte) }}</strong>
      </div>
    </div>

    <!-- Explica cómo se distribuyen los gastos del viaje.
         Interpola el número de asientos y cambia entre singular y plural
         según corresponda. También informa que el reparto es sin fines de lucro. -->
    <p class="texto-suave">
      Se divide entre los {{ asientos }}
      {{ asientos === 1 ? 'asiento' : 'asientos' }} más tu lugar
      como conductor. Conforme al reglamento UTTT, el viaje compartido es sin
      fines de lucro: solo se reparten gastos.
    </p>
  </section>
</template>

<style scoped>
/* Estilos exclusivos de este componente.
   Organiza la calculadora verticalmente y agrega separación entre elementos. */
.calculadora {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-3);
}

/* Distribuye el campo de entrada y el resultado en dos columnas.
   La primera ocupa el espacio disponible y la segunda se ajusta a su contenido.
   Alinea ambos elementos al inicio y establece una separación. */
.calculadora__fila {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--espacio-3);
}

/* Organiza verticalmente la etiqueta y el importe calculado.
   Alinea el contenido a la derecha y establece un ancho mínimo.
   Agrega relleno, bordes redondeados y un fondo de color de acento claro. */
.calculadora__resultado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
  padding: var(--espacio-2) var(--espacio-3);
  border-radius: var(--radio-md);
  background: var(--color-acento-claro);
}

/* Da mayor tamaño al importe y utiliza el color de acento
   para destacar visualmente el aporte por pasajero. */
.calculadora__resultado strong {
  font-size: 1.5rem;
  color: var(--color-acento);
}
</style>

