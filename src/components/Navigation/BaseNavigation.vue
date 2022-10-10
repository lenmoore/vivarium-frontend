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
        { name: 'admin.performances', label: 'performances' },
    ];
} else {
    navLinks = [
        { name: 'home', label: 'home' },
        { name: 'login', label: 'login' },
    ];
}
</script>

<template>
    <div class="nav-wrapper w-100 d-flex justify-content-start align-items-end">
        <nav class="nav-wrapper d-flex flex-column">
            <RouterLink
                class="nav-item"
                v-for="link in navLinks"
                :key="link.name"
                :to="{ name: link.name }"
            >
                {{ link.label }} |
            </RouterLink>
        </nav>
    </div>
</template>

<style lang="scss">
.nav-item {
    text-transform: capitalize;
    text-align: left;
    padding-bottom: 0.25rem;
}
</style>
