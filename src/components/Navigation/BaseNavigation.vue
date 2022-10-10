<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const isAuthorized = computed(() => authStore.isAuthorized);
let navLinks = [];

watch(isAuthorized, () => {
    console.log('idk what to do', isAuthorized);
});

if (isAuthorized.value) {
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'admin.humanity-shop', label: 'humanity shop' },
        { name: 'admin.performance-manager', label: 'performances' },
    ];
} else {
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'login', label: 'login' },
    ];
}
</script>

<template>
    <nav>
        <RouterLink
            class="px-2"
            v-for="link in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
        >
            {{ link.label }} |
        </RouterLink>

        <button v-if="isAuthorized" @click="authStore.logout()">log out</button>
    </nav>
</template>
