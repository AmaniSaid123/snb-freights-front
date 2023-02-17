<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Statutes',
                icon: 'pi pi-fw pi-check-square',
                to: '/statutes'
            },
            {
                label: 'Countries',
                icon: 'pi pi-fw pi-flag',
                to: '/countries'
            },
            {
                label: 'Packages',
                icon: 'pi pi-fw pi-clone',
                to: '/packages'
            },
            {
                label: 'Clients',
                icon: 'pi pi-fw pi-users',
                to: '/clients'
            },
            {
                label: 'Physical Persons',
                icon: 'pi pi-fw pi-user',
                to: '/physicalPersons'
            },
            {
                label: 'Companies',
                icon: 'pi pi-fw pi-building',
                to: '/companies'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/notfound'
            },
            {
                label: 'Error',
                icon: 'pi pi-fw pi-times-circle',
                to: '/error'
            },
            {
                label: 'Access Denied',
                icon: 'pi pi-fw pi-lock',
                to: '/access'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
     
    </ul>
</template>

<style lang="scss" scoped></style>
