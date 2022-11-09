<script setup>
import { usePerformanceStore } from '../../store/performance.store';
import { computed, reactive, ref } from 'vue';
import { useVisitorStore } from '../../store/visitor.store';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();
performanceStore.getGames();
const games = computed(() => performanceStore.games);

const phases = ref(computed(() => performanceStore.phases));
const activePhase = ref(phases.value.find((p) => p.active));
const activeGameId = activePhase.value.phase_game._id;
const activeGame = games.value.find((game) => game._id === activeGameId);
console.log('SIIN', activeGame);
const visitor = reactive(visitorStore.getVisitor);
console.log(visitor);
const state = reactive({
    game_started: false,
    current_step: null,
    step_counter: 1,
});

function startGame() {
    state.game_started = true;
    state.current_step = activeGame.game_steps[0];
}
function submitAndNext(val) {
    console.log('submitandnext val', val);
    const updateVisitor = ref(visitor);
    updateVisitor.value.quiz_results = visitorStore.getVisitor.quiz_results;
    // updateVisitor.value.quiz_results = [];
    updateVisitor.value.quiz_results.push({
        step: state.current_step,
        selected_value: {
            selected_text: val.option_text,
            selected_humanity_values: val.humanity_values,
        },
    });
    console.log('update visitor:', updateVisitor.value);
    const viss = visitorStore.editVisitor(updateVisitor.value);
    console.log(viss);
    state.step_counter++;
    if (state.step_counter !== activeGame.game_steps.length) {
        state.current_step = activeGame.game_steps[state.step_counter];
    } else {
        console.log('last step');
    }
}
</script>
<template>
    <h3>Tee häid otsuseid.</h3>
    <div v-if="state.game_started" class="game-steps-wrapper">
        <h4>{{ state.current_step.question_text }}</h4>
        <div class="options-wrapper">
            <div
                class="option"
                :key="i"
                v-for="(step, i) in state.current_step.question_options"
                @click="submitAndNext(step)"
            >
                {{ step.option_text }}
            </div>
        </div>
    </div>
    <div v-else>
        <button @click="startGame">Alusta</button>
    </div>
</template>

<style>
.option {
    border: 1px solid black;
    margin: 0.5rem;
    padding: 0.5rem;
}
</style>
