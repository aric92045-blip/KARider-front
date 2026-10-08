<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { env } from '@/core/config/env'
import { comoApiError } from '@/core/http/apiError'
import AlertMessage from '@/shared/components/AlertMessage.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import { mensajeDeError } from '@/shared/composables/useApiError'
import { useCountdown } from '@/shared/composables/useCountdown'
import { useFormulario } from '@/shared/composables/useFormulario'
import { CODIGOS_ERROR_VERIFICACION, cuenta } from '../../application/cuenta'
import { verificarCorreoEsquema } from '../../domain/esquemas'
import CodigoVerificacionInput from '../components/CodigoVerificacionInput.vue'

/** La API ignora reenvíos más frecuentes que esto. */
const SEGUNDOS_REENVIO = 60

const route = useRoute()
const router = useRouter()
const reenvio = useCountdown()

const correoQuery = typeof route.query.correo === 'string' ? route.query.correo : ''

const { valores, errores, errorGeneral, enviando, validarCampo, enviar } = useFormulario(
  verificarCorreoEsquema,
  { correoInstitucional: correoQuery, codigo: '' },
)

const avisoReenvio = ref('')
const reenviando = ref(false)

// Si venimos del registro, el código acaba de enviarse
if (route.query.enviado === '1') reenvio.iniciar(SEGUNDOS_REENVIO)

function verificar() {
  return enviar(
    async (datos) => {
      await cuenta.verificarCorreo(datos.correoInstitucional, datos.codigo)
      await router.replace({
        name: 'login',
        query: { correo: datos.correoInstitucional, verificado: '1' },
      })
    },
    {
      campoPorCodigo: Object.fromEntries(CODIGOS_ERROR_VERIFICACION.map((c) => [c, 'codigo'])),
      alError: (e) => {
        if (e.code !== 'AUTH_CORREO_YA_VERIFICADO') return false
        void router.replace({
          name: 'login',
          query: { correo: valores.value.correoInstitucional.trim() },
        })
        return true
      },
    },
  )
}

async function reenviar() {
  validarCampo('correoInstitucional')
  if (errores.value.correoInstitucional || reenvio.activo.value) return
  reenviando.value = true
  avisoReenvio.value = ''
  errorGeneral.value = null
  try {
    const r = await cuenta.reenviarCodigo(valores.value.correoInstitucional.trim())
    avisoReenvio.value = r.mensaje
    reenvio.iniciar(SEGUNDOS_REENVIO)
  } catch (err) {
    const e = comoApiError(err)
    errorGeneral.value = e
    if (e.retryAfter) reenvio.iniciar(e.retryAfter)
  } finally {
    reenviando.value = false
  }
}
</script>

<template>
  <main class="pantalla">
    <header>
      <h1 class="pantalla__titulo">Verifica tu correo</h1>
      <p class="pantalla__subtitulo">
        Te enviamos un código de 6 dígitos a tu correo institucional. Escríbelo para activar tu
        cuenta.
      </p>
    </header>

    <form class="formulario tarjeta" novalidate @submit.prevent="verificar">
      <BaseInput
        v-if="!correoQuery"
        v-model="valores.correoInstitucional"
        etiqueta="Correo institucional"
        :error="errores.correoInstitucional"
        type="email"
        inputmode="email"
        autocomplete="email"
        autocapitalize="off"
        :placeholder="`matricula@${env.dominio}`"
        @blur="validarCampo('correoInstitucional')"
      />
      <p v-else class="correo">
        <span class="texto-suave">Código enviado a</span>
        <strong>{{ correoQuery }}</strong>
      </p>

      <CodigoVerificacionInput v-model="valores.codigo" :error="errores.codigo" />

      <AlertMessage v-if="avisoReenvio" tipo="exito">{{ avisoReenvio }}</AlertMessage>
      <AlertMessage v-if="errorGeneral" tipo="error">{{
        mensajeDeError(errorGeneral)
      }}</AlertMessage>

      <BaseButton type="submit" bloque :cargando="enviando">VERIFICAR</BaseButton>

      <BaseButton
        variante="texto"
        :cargando="reenviando"
        :disabled="reenvio.activo.value"
        @click="reenviar"
      >
        {{
          reenvio.activo.value
            ? `Reenviar código en ${reenvio.restante.value} s`
            : 'Reenviar código'
        }}
      </BaseButton>
    </form>
  </main>
</template>

<style scoped>
.correo {
  display: flex;
  flex-direction: column;
  word-break: break-all;
}
</style>
