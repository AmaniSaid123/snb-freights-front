import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/statutes',
                    name: 'statutes',
                    component: () => import('@/views/pages/Status.vue')
                },
                {
                    path: '/countries',
                    name: 'countries',
                    component: () => import('@/views/pages/Countries.vue')
                },
                {
                    path: '/clients',
                    name: 'clients',
                    component: () => import('@/views/pages/Clients.vue')
                },
                {
                    path: '/packages',
                    name: 'packages',
                    component: () => import('@/views/pages/Packages.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/pages/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/Access.vue')
        },
        {
            path: '/pages/error',
            name: 'error',
            component: () => import('@/views/pages/Error.vue')
        }
    ]
});

export default router;
