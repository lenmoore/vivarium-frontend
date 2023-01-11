<template>
    <div class="page">
        <div class="d-flex align-items-start justify-content-between w-100">
            <!--            <span>-->
            <!--                <a v-if="!(isAdmin || isActor)" href="/character">X</a> - - - -->
            <!--                <RouterLink :to="{ path: '/visitor/logout' }"-->
            <!--                    >logout?</RouterLink-->
            <!--                >-->
            <!--            </span>-->
            <a :href="getActiveHomeLink()" class="text-decoration-none"
                ><h1 class="h1-color text-decoration-none">
                    VIVAARIUM
                    <span v-if="!isAdmin && !isActor"
                        >| ID_{{ visitor.wardrobe_number || '?' }}</span
                    >
                </h1>
            </a>
            <a :href="getActiveHomeLink()" class="text-decoration-none"
                ><h1>
                    <span class="material-symbols-outlined h1-color large-icon">
                        sync
                    </span>
                </h1></a
            >
        </div>

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
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import router from '@/router';
import { useVisitorStore } from '@/store/visitor.store';
import { usePerformanceStore } from '@/store/performance.store';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
let showLoginBtn = localStorage.getItem('accessToken') == null;
const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');

const phases = ref(computed(() => performanceStore.phases));
let activePhase = ref(phases.value.find((p) => p.active));
let games = ref(computed(() => performanceStore.games));
let activeGame = games.value.find(
    (game) => game?._id === activePhase?.value?.phase_game?._id
);
watch(router.currentRoute, async () => {
    showLoginBtn = localStorage.getItem('accessToken') == null;
    await performanceStore.getPhases();
});
onBeforeMount(async () => {
    if (visitor.archived === true) {
        localStorage.clear();
        location.replace('/');
    }
    activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
});

function getActiveHomeLink() {
    const phases = ref(computed(() => performanceStore.phases));
    let activePhase = ref(phases.value.find((p) => p.active));
    let games = ref(computed(() => performanceStore.games));
    activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
    if (isAdmin.value) {
        return '/';
    } else if (isActor.value) {
        return '/admin/audience';
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

.large-icon {
    font-size: 4rem;
}
</style>
