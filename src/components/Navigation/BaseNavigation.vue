<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '@/store/performance.store';

const authStore = useAuthStore();
const performanceStore = usePerformanceStore();

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
const home = { name: 'home', label: 'home' };
const basket = { name: 'visitor.humanity-shop.basket', label: 'basket' };
const scan = { name: 'visitor.humanity-shop.scan', label: 'scan' };
let navLinks = reactive({ linx: [home] });

function renderLinks() {
    console.log('render');

    // stuff from store
    const phases = ref(computed(() => performanceStore.phases));
    const activePhase = ref(phases.value.find((p) => p.active));
    const games = ref(computed(() => performanceStore.games));

    if (isAuthenticated.value && isAdmin) {
        navLinks.linx = [
            home,
            { name: 'admin.humanity-shop', label: 'humanity shop' },
            { name: 'admin.performances', label: 'performances' },
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
        }
    } else {
        navLinks.linx = [
            { name: 'home', label: 'home' },
            { name: 'login', label: '(admin) login' },
            { name: 'visitor.login', label: '(publik) login' },
        ];
    }
}
</script>

<template>
    <div class="nav-wrapper d-flex justify-content-start align-items-end">
        <nav class="nav-wrapper d-flex flex-column">
            <RouterLink
                class="nav-item"
                v-for="(link, i) in navLinks.linx"
                :key="`${navLinks.linx.length}_${i}`"
                :to="{ name: link.name }"
            >
                {{ `${navLinks.linx.length}_${i}` }} {{ link.label }}
            </RouterLink>
            <button @click="renderLinks">XX</button>
        </nav>
    </div>
</template>

<style lang="scss">
@import 'src/assets/common';
.nav-item {
    text-transform: capitalize;
    text-align: left;
    padding-bottom: 0.25rem;
    font-size: 1.5rem;
    color: $ochre;
}
.nav-wrapper {
    padding-bottom: 1rem;
}
</style>
