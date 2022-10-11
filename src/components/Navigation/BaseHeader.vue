<script setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, watch } from 'vue';
import router from '../../router';

const authStore = useAuthStore();
const isAuthorized = computed(() => authStore.isAuthorized);

const pageTitles = {
    'admin.humanity-shop': 'Humanity shop',
    products: 'Products',
    home: 'Hello',
    login: 'Logi sisse',
    'admin.humanity-shop.products': 'Tooted',
    'admin.humanity-shop.products.details': 'Toode',
    'admin.performances': 'Etendused',
    'admin.performance-manager': 'Etendused',
    'admin.performance-manager.performance': 'Etendus',
};
</script>

<template>
    <div class="d-flex align-items-center justify-content-between">
        <h1>{{ pageTitles[router.currentRoute.value.name] }}</h1>
        <div>
            <button
                class="btn btn-primary"
                v-if="isAuthorized"
                @click="authStore.logout()"
            >
                log out
            </button>
        </div>
    </div>
</template>
