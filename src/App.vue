<template>
  <div id="app">
    <router-view/>
    
    <!-- Global Notification Modal -->
    <NotificationModal
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :confirm-mode="notification.confirmMode"
      @close="closeNotification"
      @confirm="notification.onConfirm"
      @cancel="notification.onCancel"
    />
  </div>
</template>

<script setup>
import { useNotification } from './composables/useNotification'
import NotificationModal from './components/ui/NotificationModal.vue'

const { notification, closeNotification } = useNotification()
</script>