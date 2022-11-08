<script setup>
import { useAuthStore } from '@/store/auth.store';
import { usePerformanceStore } from '@/store/performance.store';
import { computed } from 'vue';

const authStore = useAuthStore();
const performanceStore = usePerformanceStore();

const activePhase = computed(() => performanceStore.getActivePhase);
const isAuthenticated = computed(() => authStore.isAuthenticated);
console.log('nice');
</script>

<template>
    <div class="home">Hello.</div>

    {{ isAuthenticated }} {{ activePhase }}
</template>
