import { createRouter, createWebHistory, type Router } from 'vue-router'

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/one' },
        {
            path: '/one',
            name: 'one',
            meta: { title: '' },
            component: () => import('@/views/one.vue')
        },
        {
            path: '/two',
            name: 'two',
            meta: { title: '' },
            component: () => import('@/views/two.vue')
        }
    ]
})

export default router