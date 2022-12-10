<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '@/store/performance.store';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

onMounted(async () => {
    await performanceStore.getGames();
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
    renderLinks();
});
const isAuthenticated = computed(() => authStore.isAuthenticated);

const isAdmin = localStorage.admin;
watch(isAuthenticated, () => {
    console.log('idk what to do', isAuthenticated);
});

// links
const home = { name: 'home', label: 'home', query: {} };
const basket = {
    name: 'visitor.humanity-shop.basket',
    label: 'basket',
    query: {},
};
const scan = { name: 'visitor.humanity-shop.scan', label: 'scan', query: {} };
const quiz = { name: 'visitor.quiz', label: 'pela', query: {} };
let navLinks = reactive({ linx: [home] });

function renderLinks() {
    console.log('render links');
    navLinks.linx = [home];
    // stuff from store
    const phases = ref(computed(() => performanceStore.phases));
    const activePhase = ref(phases.value.find((p) => p.active));
    const games = ref(computed(() => performanceStore.games));

    if (isAuthenticated.value && isAdmin) {
        navLinks.linx = [
            { name: 'superadmin', label: 'superadmin', query: {} },
            { name: 'admin.home', label: 'admin home', query: {} },
            {
                name: 'admin.humanity-shop.products',
                label: 'humanity shop',
                query: {},
            },
            { name: 'admin.performances', label: 'performances', query: {} },
        ];
    } else if (isAuthenticated.value) {
        // is authenticated as visitor
        console.log('activephase', activePhase.value);
        const activeGame = games.value.find(
            (game) => game?._id === activePhase?.value?.phase_game?._id
        );

        if (activeGame && activeGame.game_type === 'SHOP') {
            // navLinks = [home, basket, scan];
            navLinks.linx.push(basket);
            navLinks.linx.push(scan);
            console.log(navLinks);
        } else if (activeGame && activeGame.game_type === 'QUIZ') {
            navLinks.linx.push(quiz);
        }
    } else {
        navLinks.linx = [
            { name: 'home', label: 'home', query: {} },
            // { name: 'login', label: '(admin) login', query: {} },
            { name: 'visitor.login', label: '(publik) login', query: {} },
        ];
    }
}
</script>

<template>
    <nav class="container nav-wrapper">
        <RouterLink
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
            :to="{ name: link.name, query: link.query }"
            class="nav-item"
        >
            {{ `${navLinks.linx.length}_${i}` }} {{ link.label }}
        </RouterLink>
    </nav>
    <!--    <button class="btn" @click="renderLinks">XX</button>-->
</template>

<style lang="scss">
@import 'src/assets/common';

.nav-item {
    text-transform: capitalize;
    text-align: left;
    text-decoration: none;
    background-color: $orange;
    color: black;
    padding: 0.2rem 0.5rem;
    //border: $dark-blue solid 1px;
    //box-shadow: 1px 1px 20px #ffffff;
}
</style>
