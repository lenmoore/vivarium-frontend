<script setup>
import { usePerformanceStore } from '../../store/performance.store';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useVisitorStore } from '../../store/visitor.store';
import router from '../../router/index';

const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();

const state = reactive({
    game_started: false,
    game_loading: false,
    current_step: null,
    step_counter: -1,
    last_step: false,
    visitor_current_step_selected_option_text: '',
});

onBeforeMount(async () => {
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
// todo this is a little hack for determining the correct color capsule game when in the capsule, the check should be stricter and come from the store.
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

let activeGame = ref(
    games.value.find((game) => game._id === activeGameId?.value)
);

let gameStepsWithVisitorSelectedValues = ref(activeGame.value.game_steps);

async function startGame() {
    state.game_loading = true;
    if (
        localStorage.getItem(activeGame.value?._id) === 'done' ||
        activeGame?.value?.game_type === 'SHOP'
    ) {
        alert('Uus faas pole veel alanud. Proovi varsti uuesti');
        location.reload();
    } else {
        if (localStorage.getItem(activeGame.value._id) === null) {
            await addEmptyStepsToVisitor();
        } else {
            console.log('visitor.quiz_results', visitor.quiz_results);
        }
        state.game_started = true;

        state.current_step = gameStepsWithVisitorSelectedValues.value[0];
    }
    step(1);
}

watch(state, async () => {
    visitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
});

async function addEmptyStepsToVisitor() {
    for (const step1 of gameStepsWithVisitorSelectedValues.value) {
        visitor.quiz_results.push({
            step: step1,
            result_text: '-',
            result_humanity_values: {},
        });
    }
    await visitorStore.editVisitor(visitor);
    localStorage.setItem(activeGame.value._id, 'started');

    await performanceStore.getPhases();
    activePhase = reactive(performanceStore.getActivePhase);
    await performanceStore.getGames();
    // location.reload();
    state.game_loading = false;
}

function quizIsDone() {
    localStorage.setItem(activeGame.value._id, 'done');
    router.push({ name: 'visitor.quiz.done' });
}

async function selectValue(val) {
    await visitorStore.fetchVisitor(localStorage.getItem('visitorId'));
    let updateVisitor = ref(visitor);
    console.log(updateVisitor);
    let stepToUpdate = updateVisitor.value.quiz_results.find(
        (qR) => qR.step === state.current_step._id
    );
    console.log(stepToUpdate);
    stepToUpdate.result_text = val.option_text;
    stepToUpdate.result_humanity_values = val.humanity_values;
    state.visitor_current_step_selected_option_text = val.option_text;
    visitor = await visitorStore.editVisitor(updateVisitor.value);
}

function step(i) {
    state.step_counter += i;
    if (state.step_counter < gameStepsWithVisitorSelectedValues.value.length) {
        state.current_step =
            gameStepsWithVisitorSelectedValues.value[state.step_counter];
    } else {
        state.last_step = true;
    }
    state.visitor_current_step_selected_option_text = ref(
        visitor.quiz_results.find((qr) => qr.step === state.current_step._id)
            .result_text
    );
}
</script>
<template>
    <div
        class="h-100 d-flex flex-column overflow-scroll justify-content-between w-100 align-content-around"
    >
        <!--        <div v-if="state.game_loading">Arvutan...</div>-->
        <div v-if="state.game_started" class="game-steps-wrapper w-100">
            <div v-if="!state.last_step">
                <div class="buttons">
                    <button class="btn" @click="step(-1)">eelmine</button>
                    <span
                        >{{ state.step_counter + 1 }} /
                        {{ activeGame.game_steps.length }}</span
                    >
                    <button class="btn" @click="step(1)">jargmine</button>
                </div>
                <h4 class="text-center">
                    {{ state.current_step.question_text }}
                </h4>
                <div class="options-wrapper w-100">
                    <div
                        v-for="(step, i) in state.current_step.question_options"
                        :key="i"
                        :class="{
                            selected:
                                state.visitor_current_step_selected_option_text ===
                                step.option_text,
                        }"
                        class="option w-100"
                        @click="selectValue(step)"
                    >
                        {{ step.option_text }}
                    </div>
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
            <button class="w-75 btn btn-primary" @click="startGame">
                Alusta
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.option {
    border: 1px solid black;
    margin-bottom: 1rem;
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
}

.selected {
    background-color: #ff9d16;
}
</style>
