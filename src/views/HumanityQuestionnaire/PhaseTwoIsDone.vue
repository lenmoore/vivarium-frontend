<script setup>
import router from '../../router/index';
import { usePerformanceStore } from '../../store/performance.store';
import { useVisitorStore } from '../../store/visitor.store';
import { reactive, ref, computed } from 'vue';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);

const games = computed(() => performanceStore.games);

const activePhase = reactive(performanceStore.getActivePhase);
console.log(activePhase);
const activeGameId = ref(activePhase.phase_game?._id);

const activeGame = ref(
    games.value.find((game) => game._id === activeGameId.value)
);
let showWarning = ref(false);

async function startNextGame() {
    await performanceStore.getPhases();
    await performanceStore.getGames();

    let activeGame = performanceStore.games.find(
        (game) => game._id === activeGameId.value
    );
    console.log(activeGame);
    if (localStorage.getItem(activeGame.value?._id) === 'done') {
        showWarning.value = true;
    } else {
        await router.push({ name: 'visitor.quiz' });
        location.reload();
    }
}
</script>
<template>
    <div>
        See faas on nyyd samuti valmis. Kui jrgmine faas on alanud, vajuta seda
        nuppu.

        <div v-if="showWarning">
            jrgmine faas pole veel alanud. Proovi varsti uuesti.
        </div>

        <button class="btn btn-primary" @click="startNextGame">
            Alusta järgmist mängu
        </button>
    </div>
</template>
