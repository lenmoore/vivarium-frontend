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
const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');

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
    console.log('admin', isAdmin.value);
    console.log('actor', isActor.value);
    console.log('auth', isAuthenticated.value);
    const activeGame = ref(
        games.value.find(
            (game) => game?._id === activePhase?.value?.phase_game?._id
        )
    );
    console.log(activeGame.value?.game_type);
    if (isAuthenticated.value && isAdmin.value) {
        console.log('dude');
        navLinks.value.linx = [
            { name: 'admin.home', label: 'kapslid', query: {} },
            { name: 'superadmin.games', label: 'mangud', query: {} },
            { name: 'superadmin.phases', label: 'faasid', query: {} },
            {
                name: 'superadmin.performances',
                label: 'etendused',
                query: {},
            },
        ];
    } else if (isAuthenticated.value && isActor.value) {
        console.log('emm hallo');
        navLinks.value.linx = [
            { name: 'admin.home', label: 'kapslid', query: {} },
            { name: 'superadmin.phases', label: 'faasid', query: {} },
        ];
    } else if (isAuthenticated.value && !isActor.value && !isAdmin.value) {
        navLinks.value.linx = [];
        // is authenticated as visitor

        if (activeGame.value && activeGame.value.game_type === 'SHOP') {
            navLinks.value.linx.push(basket);
            navLinks.value.linx.push(scan);
        } else if (activeGame.value && activeGame.value.game_type === 'QUIZ') {
            navLinks.value.linx.push(quiz);
        }
    } else {
        navLinks.value.linx = [];
    }
}

let adminMenuOpen = ref(false);

function toggleAdminMenu() {
    adminMenuOpen.value = !adminMenuOpen.value;
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
    <div v-if="isAdmin && !adminMenuOpen">
        <button class="btn" @click="toggleAdminMenu">menu</button>
    </div>
    <button class="btn" @click="logout">logout</button>
    <nav v-if="isAdmin && adminMenuOpen" class="container nav-wrapper">
        <button class="btn" @click="toggleAdminMenu">sulge</button>
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
        </span>
        <button class="btn" @click="logout">logout</button>
    </nav>
    <nav v-else-if="isAuthenticated && isActor">
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
        </span>
        <button class="btn" @click="logout">logout</button>
    </nav>
    <nav v-else-if="isAuthenticated.value && !isActor.value && !isAdmin.value">
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
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

.nav-wrapper {
    overflow: scroll;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $bg-color;
    margin-left: 1rem;
    margin-right: 1rem;
    padding: 0.5rem;
    height: 100%;
    bottom: 0;
}

.nav-item {
    text-decoration: none;
    background-color: white;
    color: black;
    margin: 0.5rem;
    text-align: center;

    padding: 0.2rem 0.5rem;
    border: $dark-blue solid 1px;
    display: flex;
    justify-content: center;
    //box-shadow: 1px 1px 20px #ffffff;
}
</style>
