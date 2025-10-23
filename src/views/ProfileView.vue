<template>
  <div class="profile-container">
    <Header />
    <h1>My Profile</h1>
    <div v-if="user" class="profile-card card">
      <p><strong>Name:</strong> {{ user.firstName }}  {{ user.lastName }}</p>
      <p><strong>Login:</strong> {{ user.login }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <button @click="logout" class="btn btn-outline">Logout</button>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfile } from '../services/profileService.js'
import { logout as authLogout } from '../services/authService.js'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const user = ref(null)
const router = useRouter()

const loadProfile = async () => {
  try {
    user.value = await getProfile()
  } catch (error) {
    if (error.response?.status === 401) {
      // Не выводим в консоль — просто редирект
      await router.push('/auth')
    } else {
      console.error('Unexpected error loading profile:', error)
      await router.push('/auth')
    }
  }
}

const logout = () => {
  authLogout()
  router.push('/auth')
}

onMounted(() => {
  loadProfile()
})
</script>