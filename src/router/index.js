import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarDetailsView from '../views/CarDetailsView.vue'
import ProfileView from '../views/ProfileView.vue'
import ContractsView from '../views/ContractsView.vue'
import AuthView from '../views/AuthView.vue'
import api from "../services/api.js";

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    {
        path: '/car/:id',
        name: 'CarDetails',
        component: CarDetailsView,
        props: route => ({ id: Number(route.params.id) })
    },
    { path: '/profile', name: 'Profile', component: ProfileView },
    { path: '/contracts', name: 'Contracts', component: ContractsView },
    { path: '/auth', name: 'Auth', component: AuthView },
    { path: '/contract/new', name: 'CreateContract', component: () => import('../views/CreateContractView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

// ✅ Сначала создаём роутер
const router = createRouter({
    history: createWebHistory(),
    routes
})

// ✅ Потом добавляем beforeEach
router.beforeEach((to, from, next) => {
    if (to.name === 'CreateContract') {
        api.get('/profile')
            .then(() => next())
            .catch(() => next('/auth'))
    } else {
        next()
    }
})

export default router