<template>
    <div class="page">
        <a href="/"><h1 class="h1-color">VIVAARIUM</h1></a>
        <BaseHeader class="app-header" />
        <a class="font-size-xs" href="https://192.168.8.102:3000/api/games">
            kliki mind kui login lehte pole ja advanced -> proceed
        </a>
        <div class="app-wrapper">
            <a v-if="showLoginBtn" href="/visitor-login"
                ><h1>publik login</h1></a
            >
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
import { watch } from 'vue';
import router from '@/router';

let showLoginBtn = localStorage.getItem('accessToken') == null;
console.log(showLoginBtn);
watch(router.currentRoute, () => {
    showLoginBtn = localStorage.getItem('accessToken') == null;
});
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
