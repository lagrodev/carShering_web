<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo">CarShare</router-link>
      <nav class="nav" v-if="!loading">
        <!-- Гость (не авторизован) -->
        <template v-if="!user">
          <router-link to="/about" active-class="active">About</router-link>
          <router-link to="/auth" active-class="active">Login / Register</router-link>
        </template>

        <!-- Авторизован: обычный пользователь -->
        <template v-else-if="!isAdmin()">
          <router-link to="/contact" active-class="active">Contact</router-link>
          <router-link to="/profile" active-class="active">Profile</router-link>
          <button @click="logout" class="logout-btn">Logout</button>
        </template>

        <!-- Админ -->
        <template v-else>
          <router-link to="/contact" active-class="active">Contact</router-link>
          <router-link to="/profile" active-class="active">Profile</router-link>
          <router-link to="/admin" active-class="active" class="admin-link">Admin Panel</router-link>
          <button @click="logout" class="logout-btn">Logout</button>
        </template>
      </nav>
      <nav class="nav" v-else>
        <span>Loading...</span>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthInfo } from '../../services/profileService'

const user = ref(null)
const loading = ref(true)
const router = useRouter()

const isAdmin = () => {
  return user.value?.authorities?.some(a =>
      a.authority === 'ROLE_ADMIN' || a.authority === 'ROLE_MANAGER'
  )
}

const fetchProfile = async () => {
  loading.value = true
  try {
    const profile = await getAuthInfo()
    user.value = profile
  } catch (e) {
    user.value = null
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    // можно вызвать POST /api/logout с withCredentials на бэке, чтобы удалить куку
    document.cookie = 'jwt=; Max-Age=0; path=/;'
    user.value = null
    router.push('/')
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchProfile()
  window.addEventListener('auth-changed', fetchProfile)
})
</script>


<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 16px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav a {
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.nav a:hover,
.nav a.active {
  color: #2563eb;
  text-decoration: underline;
}

.admin-link {
  color: #dc2626; /* красный для админки */
  font-weight: 600;
}

.logout-btn {
  background: none;
  border: none;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
}

.logout-btn:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>