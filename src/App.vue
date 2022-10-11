<template>
    <div class="app-wrapper container">
        <BaseHeader class="app-header" />
        <div class="app-router-view">
            <RouterView />
        </div>
        <BaseNavigation class="app-navigation" />
    </div>
</template>

<script setup lang="ts">
import BaseNavigation from '@/components/Navigation/BaseNavigation.vue';
import BaseHeader from '@/components/Navigation/BaseHeader.vue';
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

.app-router-view,
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
