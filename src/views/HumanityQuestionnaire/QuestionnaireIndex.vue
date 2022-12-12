<script setup>
import { usePerformanceStore } from '../../store/performance.store';
import { computed, onMounted, reactive, ref } from 'vue';
import { useVisitorStore } from '../../store/visitor.store';
import router from '../../router/index';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();

const state = reactive({
    game_started: false,
    current_step: null,
    step_counter: 0,
    last_step: false,
});

onMounted(async () => {
    await visitorStore.fetchVisitor(localStorage.getItem('visitorId'));
    await performanceStore.getGames();
    await performanceStore.getPhases();
});

const phases = computed(() => performanceStore.phases);
const games = computed(() => performanceStore.games);
console.log(phases);
let visitor = reactive(visitorStore.getVisitor);
let colors = {
    'blue-sky': 'orange',
    fuchsia: 'fuchsia',
    silver: 'blue',
    lime: 'green',
};
// todo this is a little hack, it should be stricter
let capsuleColor = colors[visitor.confirmed_humanity_value];

let activePhase = ref(
    phases?.value.find(
        (phase) =>
            phase.active &&
            ((visitor.confirmed_humanity_value &&
                phase.phase_game.open_for_colors.includes(capsuleColor)) ||
                visitor.confirmed_humanity_value === 'none')
    )
);
const activeGameId = ref(activePhase.value?.phase_game?._id);

let activeGame = reactive(
    games.value.find((game) => game._id === activeGameId?.value)
);

async function startGame() {
    await performanceStore.getPhases();
    activePhase = reactive(performanceStore.getActivePhase);
    await performanceStore.getGames();

    activeGame = games.value.find((game) => game._id === activeGameId.value);

    if (
        localStorage.getItem(activeGame?._id) === 'done' ||
        activeGame.game_type === 'SHOP'
    ) {
        alert('Uus faas pole veel alanud. Proovi varsti uuesti');
    } else {
        state.game_started = true;
        state.current_step = activeGame.game_steps[0];
    }
}

function quizIsDone() {
    console.log('done');
    localStorage.setItem(activeGame._id, 'done');
    router.push({ name: 'visitor.quiz.done' });
}

function submitAndNext(val) {
    let updateVisitor = ref(visitor);
    console.log(val);
    console.log(updateVisitor);

    updateVisitor.value.quiz_results = visitorStore.getVisitor.quiz_results;
    updateVisitor.value.quiz_results.push({
        step: state.current_step,
        result_text: val.option_text,
        result_humanity_values: val.humanity_values,
    });
    console.log('update visitor:', updateVisitor.value);
    const viss = visitorStore.editVisitor(updateVisitor.value);
    console.log(viss);
    state.step_counter++;
    if (state.step_counter < activeGame.game_steps.length) {
        state.current_step = activeGame.game_steps[state.step_counter];
    } else {
        state.last_step = true;
    }
}
</script>
<template>
    <div
        class="h-100 d-flex flex-column justify-content-between align-content-around"
    >
        <div v-if="state.game_started" class="game-steps-wrapper">
            <div v-if="!state.last_step">
                <h4 class="text-center">
                    {{ state.current_step.question_text }}
                </h4>
                <div class="options-wrapper">
                    <div
                        v-for="(step, i) in state.current_step.question_options"
                        :key="i"
                        class="option"
                        @click="submitAndNext(step)"
                    >
                        {{ step.option_text }}
                    </div>
                </div>

                <div class="buttons">
                    <button class="btn">eelmine</button>
                    <span
                        >{{ state.step_counter + 1 }} /
                        {{ activeGame.game_steps.length }}</span
                    >
                    <button class="btn">jargmine</button>
                </div>
            </div>
            <div v-else>
                <button class="btn btn-primary" @click="quizIsDone">
                    Valmis
                </button>
            </div>
        </div>
        <div
            v-else
            class="d-flex align-items-center w-100 h-100 justify-content-center"
        >
            <button
                class="w-75 btn btn-outline-primary"
                @click="window.location.reload"
            >
                Varskenda lehte
            </button>
            <button class="w-75 btn btn-primary" @click="startGame">
                Alusta
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.option {
    border: 1px solid black;
    margin: 1rem;
    padding: 0.5rem;
}

.game-steps-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}

.buttons {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    margin-top: 3rem;
}
</style>
