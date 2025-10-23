import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(
    inputRef,
    listClass,
    isFocusedRef
) {
    const handleClick = (event) => {
        const clickedInside = inputRef.value && (
            inputRef.value.contains(event.target) ||
            event.target.closest(`.${listClass}`)
        )
        if (!clickedInside) {
            isFocusedRef.value = false
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClick)
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleClick)
    })
}