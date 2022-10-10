<template>
    <div class="app-wrapper">
        <BaseHeader class="app-header" />
        <RouterView class="app-router-view" />
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
    height: 90%;
}

.app-wrapper {
    display: block;
    height: available;
}

.app-router-view,
.app-header {
    padding: 1rem;
}
.app-navigation {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 1rem;
    width: 100%;
    text-align: center;
}
</style>
