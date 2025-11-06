import { ref } from 'vue'

const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  confirmMode: false,
  onConfirm: null,
  onCancel: null
})

export function useNotification() {
  const showNotification = ({ type = 'info', title, message }) => {
    notification.value = {
      show: true,
      type,
      title: title || getDefaultTitle(type),
      message,
      confirmMode: false,
      onConfirm: null,
      onCancel: null
    }
  }

  const showConfirm = ({ type = 'warning', title, message, onConfirm, onCancel }) => {
    return new Promise((resolve) => {
      notification.value = {
        show: true,
        type,
        title: title || getDefaultTitle(type),
        message,
        confirmMode: true,
        onConfirm: () => {
          if (onConfirm) onConfirm()
          resolve(true)
          closeNotification()
        },
        onCancel: () => {
          if (onCancel) onCancel()
          resolve(false)
          closeNotification()
        }
      }
    })
  }

  const closeNotification = () => {
    notification.value.show = false
  }

  const getDefaultTitle = (type) => {
    const titles = {
      success: 'Успешно',
      error: 'Ошибка',
      warning: 'Внимание',
      info: 'Информация'
    }
    return titles[type] || 'Уведомление'
  }

  return {
    notification,
    showNotification,
    showConfirm,
    closeNotification
  }
}
