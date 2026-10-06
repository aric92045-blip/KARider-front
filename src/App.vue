<script setup>
import { ref, onMounted } from 'vue'
const apiUrl = import.meta.env.VITE_API_URL
const mensaje = ref('Cargando...')
onMounted(async () => {
  try {
    const r = await fetch(`${apiUrl}/api/saludo`)
    mensaje.value = (await r.json()).mensaje
  } catch {
    mensaje.value = 'No se pudo conectar con la API'
  }
})
</script>

<template>
  <main>
    <h1>KARider v1</h1>
    <p>{{ mensaje }}</p>
  </main>
</template>