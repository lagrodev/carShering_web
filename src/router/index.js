import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarDetailsView from '../views/CarDetailsView.vue'
import ProfileView from '../views/ProfileView.vue'
import ContractsView from '../views/ContractsView.vue'
import AuthView from '../views/AuthView.vue'
import { useAuthStore } from '../store/auth'

const routes = [
    { 
        path: '/', 
        name: 'Home', 
        component: HomeView,
        meta: { requiresAuth: false }
    },
    {
        path: '/car/:id',
        name: 'CarDetails',
        component: CarDetailsView,
        props: route => ({ id: Number(route.params.id) }),
        meta: { requiresAuth: false }
    },
    { 
        path: '/profile', 
        name: 'Profile', 
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    { 
        path: '/contracts', 
        name: 'Contracts', 
        component: ContractsView,
        meta: { requiresAuth: true }
    },
    { 
        path: '/contracts/:id', 
        name: 'ContractDetails', 
        component: () => import('../views/ContractDetailsView.vue'),
        meta: { requiresAuth: true }
    },
    { 
        path: '/auth', 
        name: 'Auth', 
        component: AuthView,
        meta: { requiresAuth: false }
    },
    { 
        path: '/contract/new', 
        name: 'CreateContract', 
        component: () => import('../views/CreateContractView.vue'),
        meta: { requiresAuth: true }
    },
    { 
        path: '/admin', 
        name: 'Admin', 
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/cars/new', 
        name: 'AdminCarCreate', 
        component: () => import('../views/AdminCarCreateView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/cars/:id', 
        name: 'AdminCarDetails', 
        component: () => import('../views/AdminCarDetailsView.vue'),
        props: route => ({ id: Number(route.params.id) }),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/users/:id', 
        name: 'AdminUserDetails', 
        component: () => import('../views/AdminUserDetailsView.vue'),
        props: route => ({ id: Number(route.params.id) }),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/contracts/:id', 
        name: 'AdminContractDetails', 
        component: () => import('../views/AdminContractDetailsView.vue'),
        props: route => ({ id: Number(route.params.id) }),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/' 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard для защиты приватных маршрутов
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Если маршрут НЕ требует аутентификации, сразу пропускаем
    if (!to.meta.requiresAuth) {
        next()
        return
    }
    
    // Маршрут требует аутентификации
    // Проверяем, есть ли уже загруженный пользователь
    if (!authStore.user && !authStore.loading) {
        // Пытаемся проверить авторизацию (тихо, без редиректа)
        try {
            const isAuth = await authStore.checkAuth()
            if (!isAuth) {
                // Не авторизован - перенаправляем на страницу входа
                next({ name: 'Auth', query: { redirect: to.fullPath } })
                return
            }
        } catch (err) {
            // Ошибка при проверке - считаем что не авторизован
            next({ name: 'Auth', query: { redirect: to.fullPath } })
            return
        }
    }
    
    // Если пользователь не авторизован, перенаправляем на вход
    if (!authStore.isAuthenticated) {
        next({ name: 'Auth', query: { redirect: to.fullPath } })
        return
    }
    
    // Проверяем права администратора для админских маршрутов
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        next({ name: 'Home' })
        return
    }
    
    // Пользователь авторизован, пропускаем
    next()
})

export default router