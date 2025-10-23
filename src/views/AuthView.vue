<!-- AuthView.vue -->
<template>
  <form @submit.prevent="login">
    <input v-model="credentials.username" placeholder="Login" required />
    <input v-model="credentials.password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { login as apiLogin } from '../services/authService'

const credentials = ref({ username: '', password: '' })

const login = async () => {
  try {
    await apiLogin(credentials.value) // с withCredentials
    // После успешного логина — редирект (перезагрузка) или диспатч события
    // Перезагрузка гарантирует, что header прочитает профиль заново
    window.location.href = '/catalogue'
  } catch (error) {
    alert('Login failed: ' + (error.response?.data?.message || error.message))
  }
}
</script>