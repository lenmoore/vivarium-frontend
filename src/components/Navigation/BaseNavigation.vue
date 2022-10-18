<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
let navLinks = [];

const isAdmin = localStorage.admin;
watch(isAuthenticated, () => {
    console.log('idk what to do', isAuthenticated);
});

if (isAuthenticated.value && isAdmin) {
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'admin.humanity-shop', label: 'humanity shop' },
        { name: 'admin.performances', label: 'performances' },
    ];
} else if (isAuthenticated.value) {
    // is authenticated as visitor
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'visitor.humanity-shop.basket', label: 'basket' },
        { name: 'visitor.humanity-shop.scan', label: 'scan' },
    ];
} else {
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'login', label: '(admin) login' },
        { name: 'visitor.login', label: '(publik) login' },
    ];
}
</script>

<template>
    <div class="nav-wrapper d-flex justify-content-start align-items-end">
        <nav class="nav-wrapper d-flex flex-column">
            <RouterLink
                class="nav-item"
                v-for="link in navLinks"
                :key="link.name"
                :to="{ name: link.name }"
            >
                {{ link.label }}
            </RouterLink>
        </nav>
    </div>
</template>

<style lang="scss">
@import 'src/assets/common';
.nav-item {
    text-transform: capitalize;
    text-align: left;
    padding-bottom: 0.25rem;
    font-size: 1.5rem;
    color: $ochre;
}
.nav-wrapper {
    padding-bottom: 1rem;
}
</style>
