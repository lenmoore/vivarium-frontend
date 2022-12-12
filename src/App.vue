<template>
    <div class="page">
        <h1 class="h1-color">VIVAARIUM</h1>
        <BaseHeader class="app-header" />
        <a href="https://192.168.237.106:3000/api/games">
            kliki mind kui ei saa apiga yhendust
        </a>
        <div class="app-wrapper">
            <div class="app-router-view">
                <RouterView :key="$route.fullPath" />
            </div>
        </div>
        <BaseNavigation ref="nav" class="app-navigation" />
    </div>
</template>

<script lang="ts" setup>
import BaseNavigation from '@/components/Navigation/BaseNavigation.vue';
import BaseHeader from '@/components/Navigation/BaseHeader.vue';
import { usePerformanceStore } from '@/store/performance.store';
import { computed, nextTick, ref, watch } from 'vue';

nextTick();
</script>

<style lang="scss">
html,
body,
#app,
.app-wrapper,
.app-router-view {
    height: 94%;
}

.app-wrapper {
    display: block;
    height: available;
}

.app-header {
    padding: 1rem;
}

.app-router-view {
    overflow: scroll;
}

.app-navigation {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-right: auto;
    margin-left: auto;
}
</style>
