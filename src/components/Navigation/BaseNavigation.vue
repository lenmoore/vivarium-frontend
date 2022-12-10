<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '@/store/performance.store';
import router from '@/router';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

onMounted(async () => {
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
const home = { name: 'home', label: 'home', query: {} };
const basket = {
    name: 'visitor.humanity-shop.basket',
    label: 'Korv',
    query: {},
};
const scan = { name: 'visitor.humanity-shop.scan', label: 'Pood', query: {} };
const quiz = { name: 'visitor.quiz', label: 'pela', query: {} };
let navLinks = ref({ linx: [home] });

function renderLinks() {
    const isAuthenticated = localStorage.accessToken != null;
    console.log('>>>>>isauthenticated', isAuthenticated);

    console.log('render links');
    console.log(isAuthenticated);
    navLinks.value.linx = [home];
    // stuff from store
    const phases = ref(computed(() => performanceStore.phases));
    const activePhase = ref(phases.value.find((p) => p.active));
    const games = ref(computed(() => performanceStore.games));

    if (isAuthenticated && isAdmin) {
        navLinks.value.linx = [
            { name: 'superadmin', label: 'superadmin', query: {} },
            { name: 'admin.home', label: 'admin home', query: {} },
            {
                name: 'admin.humanity-shop.products',
                label: 'humanity shop',
                query: {},
            },
            { name: 'admin.performances', label: 'performances', query: {} },
        ];
    } else if (isAuthenticated) {
        // is authenticated as visitor
        console.log('activephase', activePhase.value);
        const activeGame = games.value.find(
            (game) => game?._id === activePhase?.value?.phase_game?._id
        );

        if (activeGame && activeGame.game_type === 'SHOP') {
            // navLinks = [home, basket, scan];
            navLinks.value.linx.push(basket);
            navLinks.value.linx.push(scan);
            console.log(navLinks);
        } else if (activeGame && activeGame.game_type === 'QUIZ') {
            navLinks.value.linx.push(quiz);
        }
    } else {
        navLinks.value.linx = [
            { name: 'home', label: 'home', query: {} },
            // { name: 'login', label: '(admin) login', query: {} },
            { name: 'visitor.login', label: '(publik) login', query: {} },
        ];
    }
}

const isIntroView = router.currentRoute.value.name === 'visitor.intro';
</script>

<template>
    <nav v-if="!isIntroView" class="container nav-wrapper">
        <RouterLink
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
            :to="{ name: link.name, query: link.query }"
            class="nav-item"
        >
            {{ link.label }}
        </RouterLink>
    </nav>
    <!--    <button class="btn" @click="renderLinks">XX</button>-->
</template>

<style lang="scss">
@import 'src/assets/common';

.nav-item {
    text-transform: capitalize;
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
