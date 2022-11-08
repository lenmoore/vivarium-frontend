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
console.log(game);

const newStep = new Step({
    question_text: '',
    question_options: [],
});

async function addStep(val) {
    console.log(val);
    console.log(game);
    let gameToSend = game.value;
    gameToSend.game_steps.push(val);
    console.log(gameToSend);
    await performanceStore.editGame(gameToSend);
}
async function editStep(val) {
    console.log(val);
    console.log(game);
    console.log(game.value.game_steps);
    game.value.game_steps.push(val);
    console.log(game);
    await performanceStore.editGame(game.value);
}
</script>
<template>
    <div v-if="game">
        <h3>{{ game.name }}</h3>

        <GameStep id="new-step" :step="newStep" @submit="addStep" />
        <div
            :key="`step_${i}`"
            :id="`step_${i}`"
            v-for="(step, i) in game.game_steps"
        >
            <GameStep :step="step" @submit="editStep" />
        </div>
    </div>
</template>
