<script setup>
import router from '../../../router/index';
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onMounted, reactive, ref } from 'vue';
import GameStep from './GameStep.vue';
import { Step } from '../../../types/performances.types';
const performanceStore = usePerformanceStore();

const id = router.currentRoute.value.params.id;
console.log('game id->>>>', id);

onMounted(() => {
    performanceStore.getGames();
});

let game = computed(() => performanceStore.getGame(id));

let newStep = new Step({
    question_text: '',
    question_options: [],
});

async function addStep(val) {
    let gameToSend = game.value;
    gameToSend.game_steps.push(val);
    await performanceStore.editGame(gameToSend);
}
async function editStep(val) {
    game.value.game_steps.push(val);
    await performanceStore.editGame(game.value);
}
</script>
<template>
    <div v-if="game">
        <h3>{{ game.name }}</h3>

        lisa uus:
        <GameStep id="new-step" :step="newStep" @submit="addStep" />

        kysimused:
        <div
            :key="`step_${i}`"
            :id="`step_${i}`"
            v-for="(step, i) in game.game_steps"
        >
            <GameStep :step="step" @submit="editStep" />
        </div>
    </div>
</template>
