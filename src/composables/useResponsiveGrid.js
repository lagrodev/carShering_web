import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useResponsiveGrid() {
    const cardsPerRow = ref(4)
    const maxRows = 5
    const itemsPerPage = computed(() => cardsPerRow.value * maxRows)

    const updateCardsPerRow = () => {
        const width = window.innerWidth
        if (width < 600) cardsPerRow.value = 1
        else if (width < 900) cardsPerRow.value = 2
        else if (width < 1200) cardsPerRow.value = 3
        else cardsPerRow.value = 4
    }

    onMounted(() => {
        updateCardsPerRow()
        window.addEventListener('resize', updateCardsPerRow)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateCardsPerRow)
    })

    return { cardsPerRow, itemsPerPage }
}