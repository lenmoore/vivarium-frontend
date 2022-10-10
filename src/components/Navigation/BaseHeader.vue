<script setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, watch } from 'vue';

const authStore = useAuthStore();
const isAuthorized = computed(() => authStore.isAuthorized);
</script>

<template>
    <div class="d-flex align-items-center justify-content-between">
        <h1>Etendused</h1>
        <button
            class="btn btn-primary"
            v-if="isAuthorized"
            @click="authStore.logout()"
        >
            log out
        </button>
    </div>
</template>
