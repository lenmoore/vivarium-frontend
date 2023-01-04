<template>
    <div class="page">
        <a :href="getActiveHomeLink()" class="text-decoration-none"
            ><h1 class="h1-color text-decoration-none">VIVAARIUM</h1>
            <h1
                v-if="visitor.wardrobe_number"
                class="d-flex justify-content-center"
            >
                ID_{{ visitor.wardrobe_number }}
            </h1></a
        >
        <!--        <a class="font-size-xs" href="https://10.0.0.244:3000/api/games">-->
        <!--            kliki mind kui login lehte pole ja advanced -> proceed-->
        <!--        </a>-->
        <div class="app-wrapper">
            <!--            <a v-if="showLoginBtn" href="/visitor-login"-->
            <!--                ><h1>publik login</h1></a-->
            <!--            >-->
            <div class="app-router-view">
                <RouterView :key="$route.fullPath" />
            </div>
        </div>
        <BaseNavigation ref="nav" class="app-navigation" />
    </div>
</template>

<script lang="ts" setup>
import BaseNavigation from '@/components/Navigation/BaseNavigation.vue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import router from '@/router';
import { useVisitorStore } from '@/store/visitor.store';
import { usePerformanceStore } from '@/store/performance.store';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();
const visitor = visitorStore.getVisitor;
let showLoginBtn = localStorage.getItem('accessToken') == null;
let isAdmin = localStorage.admin;

const phases = ref(computed(() => performanceStore.phases));
let activePhase = ref(phases.value.find((p) => p.active));
let games = ref(computed(() => performanceStore.games));
let activeGame = games.value.find(
    (game) => game?._id === activePhase?.value?.phase_game?._id
);
watch(router.currentRoute, () => {
    showLoginBtn = localStorage.getItem('accessToken') == null;
    isAdmin = localStorage.admin;
});
onBeforeMount(async () => {
    // await performanceStore.getGames();
    // await performanceStore.getPhases();
    // await performanceStore.getPerformances();
    activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
});

function getActiveHomeLink() {
    const phases = ref(computed(() => performanceStore.phases));
    let activePhase = ref(phases.value.find((p) => p.active));
    let games = ref(computed(() => performanceStore.games));
    let activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
    if (isAdmin || showLoginBtn) {
        return '/';
    }

    if (activeGame && activeGame.game_type === 'SHOP') {
        console.log('ou');
        return '/visitor/humanity-shop/basket';
    } else if (activeGame && activeGame.game_type === 'QUIZ') {
        return '/visitor/quiz';
    }
    return '/';
}
</script>

<style lang="scss">
html,
body,
#app,
.app-wrapper,
.app-router-view {
    height: 97%;
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
