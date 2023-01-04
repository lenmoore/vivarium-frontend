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
    active_game: null,
});
let stateVIsitor = localStorage.getItem('visitor');
let visitor = stateVIsitor;
onBeforeMount(async () => {
    await performanceStore.getGames();
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
    await visitorStore.fetchVisitor(localStorage.getItem('visitorId'));
    stateVIsitor = visitorStore.getVisitor;
    localStorage.setItem('visitorId', stateVIsitor.visitorId);
});
const phases = ref(computed(() => performanceStore.phases));
let activePhase = ref(phases.value.find((p) => p.active));
let games = ref(computed(() => performanceStore.games));
state.activeGame = games.value.find(
    (game) => game?._id === activePhase?.value?.phase_game?._id
);
let colors = {
    turq: 'orange',
    fuchsia: 'fuchsia',
    silver: 'blue',
    lime: 'green',
};
// todo this is a little hack for determining the correct color capsule game when in the capsule, the check should be stricter and come from the store.
let capsuleColor = colors[visitor.confirmed_humanity_value];

// if (
//     phase.active &&
//     (visitor.confirmed_humanity_value === 'none' ||
//         phase.phase_game.open_for_colors.includes(capsuleColor))
// ) {
//     activePhase = phase;
//     activeGameId = phase.phase_game._id;
// }

let gameStepsWithVisitorSelectedValues = ref(state.activeGame?.game_steps);

async function startGame() {
    state.step_counter = 0;
    state.game_loading = true;
    if (
        localStorage.getItem(state.activeGame?._id) === 'done' ||
        state.activeGame?.game_type === 'SHOP'
    ) {
        alert('Uus faas pole veel alanud. Proovi varsti uuesti');
        location.reload();
    } else {
        console.log(state.activeGame);
        if (localStorage.getItem(state.activeGame?._id) === null) {
            await addEmptyStepsToVisitor();
        } else {
            console.log('visitor.quiz_results', visitor.quiz_results);
        }
        state.current_step =
            gameStepsWithVisitorSelectedValues?.value[state.step_counter];
    }
    step(1);
}

watch(state, async () => {
    visitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
});

async function addEmptyStepsToVisitor() {
    games.value = await performanceStore.getGames();
    phases.value = await performanceStore.getPhases();
    visitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
    let activePhase = ref(
        phases.value?.find(
            (phase) =>
                phase.active &&
                ((visitor.confirmed_humanity_value &&
                    phase.phase_game.open_for_colors.includes(capsuleColor)) ||
                    visitor.confirmed_humanity_value === 'none')
        )
    );
    console.log(activePhase);
    const activeGameId = ref(activePhase.value?.phase_game?._id);
    console.log(activeGameId);
    state.activeGame = ref(
        games?.value?.find((game) => game._id === activeGameId?.value)
    );
    console.log(state.activeGame.value);
    gameStepsWithVisitorSelectedValues = reactive(state.activeGame?.game_steps);

    console.log(visitor);
    if (state.activeGame.value) {
        for (let step1 of state.activeGame?.game_steps) {
            visitor.quiz_results.push({
                step: step1,
                result_text: '-',
                result_humanity_values: {},
            });
        }
        localStorage.setItem(state.activeGame._id, 'started');
    }
    await visitorStore.editVisitor(visitor);

    state.game_started = true;
    // state.current_step = gameStepsWithVisitorSelectedValues.value[0];

    // await performanceStore.getPhases();
    // activePhase = reactive(performanceStore.getActivePhase);
    // await performanceStore.getGames();
    state.game_loading = false;
    step(1);
}

function quizIsDone() {
    console.log(state.activeGame);
    localStorage.setItem(state.activeGame?._id, 'done');
    location.reload();
}

async function selectValue(val) {
    visitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
    let updateVisitor = ref(visitor);
    console.log(updateVisitor);
    let stepToUpdate = Object.values(updateVisitor.value.quiz_results).find(
        (qR) => qR.step === state.current_step._id
    );
    console.log(stepToUpdate);
    stepToUpdate.result_text = val.option_text;
    stepToUpdate.result_humanity_values = val.humanity_values;
    state.visitor_current_step_selected_option_text = val.option_text;
    visitor = await visitorStore.editVisitor(updateVisitor.value);
    // step(1);
}

function step(i) {
    console.log(state);
    console.log(gameStepsWithVisitorSelectedValues);
    state.game_loading = false;
    state.game_started = true;
    state.step_counter += i;
    if (
        state.step_counter <
        Object.values(gameStepsWithVisitorSelectedValues).length
    ) {
        console.log('length');
        state.current_step = Object.values(gameStepsWithVisitorSelectedValues)[
            state.step_counter
        ];
    } else {
        state.last_step = true;
    }
    state.visitor_current_step_selected_option_text = ref(
        visitor.quiz_results.find((qr) => qr.step === state.current_step._id)
            .result_text
    );
}

// function shuffle(array) {
//     let currentIndex = array.length,
//         randomIndex;
//
//     // While there remain elements to shuffle.
//     while (currentIndex !== 0) {
//         // Pick a remaining element.
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex--;
//
//         // And swap it with the current element.
//         [array[currentIndex], array[randomIndex]] = [
//             array[randomIndex],
//             array[currentIndex],
//         ];
//     }
//
//     return array;
// }
</script>
<template>
    <div
        class="h-100 d-flex flex-column overflow-scroll justify-content-between w-100 align-content-around"
    >
        <div v-if="state.game_loading">
            <img alt="loader" src="/public/Spinner-1s-200px.gif" />
        </div>
        <div
            v-if="!state.game_started"
            class="d-flex align-items-center w-100 h-100 justify-content-center"
        >
            (Vajuta nuppu ja oota. See võib mõne aja laadida.)
            <button class="w-75 btn btn-primary" @click="startGame">
                Alusta
            </button>
        </div>
        <div class="buttons w-100">
            <button class="btn btn-outline-primary" @click="step(-1)">
                eelmine
            </button>
            <!--            <span-->
            <!--                >{{ state.step_counter + 1 }} /-->
            <!--                {{-->
            <!--                    activeGame?.game_steps ? activeGame?.game_steps?.length : 0-->
            <!--                }}</span-->
            <!--            >-->
            <button class="btn btn-primary" @click="step(1)">jargmine</button>
        </div>
        <!--        <div v-if="state.game_loading">Arvutan...</div>-->
        <div v-if="state.game_started" class="game-steps-wrapper w-100 h-100">
            <div
                v-if="!state.last_step"
                class="w-100 d-flex flex-column justify-content-between h-100"
            >
                <div>
                    <h4 class="text-center">
                        {{
                            state.current_step &&
                            state.current_step.question_text
                        }}
                    </h4>
                    <div class="options-wrapper w-100">
                        <div
                            v-for="(step, i) in state.current_step
                                .question_options"
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
            </div>
            <div v-else>
                <button class="btn btn-primary" @click="quizIsDone">
                    Valmis
                </button>
            </div>
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

    * {
        width: 30%;
    }
}

.selected {
    background-color: #ff9d16;
}
</style>
