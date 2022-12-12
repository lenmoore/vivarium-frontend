<script setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, watch } from 'vue';
import router from '../../router';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = localStorage.admin;
const pageTitles = {
    products: 'Products',
    home: 'Hello',
    login: 'Logi sisse',
    'superadmin.games.humanity-shop.products': 'Tooted',
    'superadmin.games.humanity-shop.details': 'Toode',
    'superadmin.performances': 'Etendused',
    'superadmin.performance-manager': 'Etendused',
    'superadmin.performance-manager.performance': 'Etendus',
};
</script>

<template></template>
