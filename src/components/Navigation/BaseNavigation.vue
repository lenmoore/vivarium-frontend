<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '@/store/performance.store';
import router from '@/router';
import { LocationQueryRaw } from 'vue-router';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

onBeforeMount(async () => {
    await performanceStore.getGames();
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
    renderLinks();
});
const isAdmin = localStorage.admin;

watch(router.currentRoute, () => {
    console.log('route change');
    renderLinks();
});
// links
const home = { name: 'home', label: 'mina', query: {} };
const basket = {
    name: 'visitor.humanity-shop.basket',
    label: 'Korv',
    query: {},
};
const scan = { name: 'visitor.humanity-shop.scan', label: 'Pood', query: {} };
const quiz = { name: 'visitor.quiz', label: 'küsitlus', query: {} };
let navLinks = ref({ linx: [home] });

const isAuthenticated = ref(localStorage.getItem('accessToken') != null);

function renderLinks() {
    // stuff from store
    const phases = ref(computed(() => performanceStore.phases));
    const activePhase = ref(phases.value.find((p) => p.active));
    const games = ref(computed(() => performanceStore.games));

    if (isAuthenticated.value && isAdmin) {
        console.log('dude');
        navLinks.value.linx = [
            { name: 'superadmin', label: 'superadmin', query: {} },
            { name: 'admin.home', label: 'näitleja dashboard', query: {} },
        ];
    } else if (isAuthenticated.value) {
        navLinks.value.linx = [];
        // is authenticated as visitor
        const activeGame = games.value.find(
            (game) => game?._id === activePhase?.value?.phase_game?._id
        );

        if (activeGame && activeGame.game_type === 'SHOP') {
            navLinks.value.linx.push(basket);
            navLinks.value.linx.push(scan);
        } else if (activeGame && activeGame.game_type === 'QUIZ') {
            navLinks.value.linx.push(quiz);
        }
    } else {
        navLinks.value.linx = [];
    }
}

// todo fix this stupid hack
async function goTo(link: {
    name: string;
    query: LocationQueryRaw;
    label: string;
}) {
    if (
        router.currentRoute.value.name
            ?.toString()
            .split('.')
            .includes(link.name.split('.')[0])
    ) {
        console.log('te');
        location.replace(router.currentRoute.value.fullPath);
        // renderLinks();
    } else {
        await router.push('/');
        await router.push({ name: link.name, query: link.query });
    }
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
    location.reload();
}
</script>

<template>
    <nav v-if="isAdmin" class="container nav-wrapper">
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
        </span>
    </nav>
    <nav v-else-if="isAuthenticated">
        <span>
            <a class="nav-item" href="/visitor/quiz"> Küsimused </a>
            <a class="nav-item" href="/visitor/humanity-shop/basket"> Pood </a>
        </span>
    </nav>
    <button
        v-if="isAuthenticated && $route.path === '/visitor/logout'"
        class="btn"
        @click="logout"
    >
        logout
    </button>
    <!--    <button class="btn" @click="renderLinks">XX</button>-->
</template>

<style lang="scss">
@import 'src/assets/common';

.nav-item {
    text-decoration: none;
    background-color: white;
    color: black;
    width: 100%;
    margin: 0.5rem;
    text-align: center;

    padding: 0.2rem 0.5rem;
    border: $dark-blue solid 1px;
    display: flex;
    justify-content: center;
    //box-shadow: 1px 1px 20px #ffffff;
}
</style>
