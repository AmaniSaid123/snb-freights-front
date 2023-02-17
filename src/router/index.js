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
                },
                {
                    path: '/physicalPersons',
                    name: 'physicalPersons',
                    component: () => import('@/views/pages/PhysicalPersons.vue')
                },
                {
                    path: '/companies',
                    name: 'companies',
                    component: () => import('@/views/pages/Companies.vue')
                }
            ]
        },
        
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },

        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/Access.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/pages/Error.vue')
        }
        
    ]
});

export default router;
