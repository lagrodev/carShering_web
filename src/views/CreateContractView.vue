<!-- views/CreateContractView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clientApi } from '../api/client.js'

const route = useRoute()
const router = useRouter()

const carId = ref(null)
const dataStart = ref('')
const dataEnd = ref('')
const car = ref(null)
const loading = ref(false)

onMounted(async () => {
  const id = route.query.carId
  if (!id) {
    router.push('/catalogue')
    return
  }
  carId.value = Number(id)
  try {
    car.value = await clientApi.getCar(carId.value)
  } catch (error) {
    alert('Не удалось загрузить автомобиль')
    router.push('/catalogue')
  }
})

const handleSubmit = async () => {
  if (!dataStart.value || !dataEnd.value) {
    alert('Выберите даты аренды')
    return
  }

  const request = {
    carId: carId.value,
    dataStart: dataStart.value,
    dataEnd: dataEnd.value
  }

  try {
    loading.value = true
    await clientApi.createContract(request)
    alert('Договор успешно создан!')
    router.push('/profile')
  } catch (error) {
    const msg = error.response?.data?.message || 'Ошибка при создании договора'
    alert(msg)
    console.log(error + 'Ошибка при создании договора')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
    <h2>Аренда: {{ car?.brand }} {{ car?.model }}</h2>

    <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label>Дата начала аренды:</label>
        <input type="date" v-model="dataStart" required />
      </div>
      <div>
        <label>Дата окончания аренды:</label>
        <input type="date" v-model="dataEnd" required />
      </div>

      <button
          type="submit"
          :disabled="loading"
          style="
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        "
      >
        {{ loading ? 'Отправка...' : 'Подтвердить аренду' }}
      </button>
    </form>
  </div>
</template>