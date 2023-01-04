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
let gameStepsWithVisitorSelectedValues = [];
onBeforeMount(async () => {
    await performanceStore.getGames();
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
    stateVIsitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
    console.log(stateVIsitor.quiz_results);
    localStorage.setItem('visitorId', stateVIsitor.visitorId);

    const phases = ref(computed(() => performanceStore.phases));
    let activePhase = ref(phases.value.find((p) => p.active));
    let games = ref(computed(() => performanceStore.games));
    state.activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
    console.log('active Game ->>>>> ', state.activeGame);
    gameStepsWithVisitorSelectedValues = ref(stateVIsitor.quiz_results);
    gameStepsWithVisitorSelectedValues =
        gameStepsWithVisitorSelectedValues.value.filter(
            (qr) => qr.game === state.activeGame._id
        );
    console.log(gameStepsWithVisitorSelectedValues);
});
let visitor = stateVIsitor;

let colors = {
    turq: 'orange',
    fuchsia: 'fuchsia',
    silver: 'blue',
    lime: 'green',
};
let capsuleColor = colors[visitor.confirmed_humanity_value];

// todo this is a little hack for determining the correct color capsule game when in the capsule, the check should be stricter and come from the store.

async function startGame() {
    console.log('active game id', state?.activeGame?._id);
    state.step_counter = 0;
    state.game_loading = true;

    console.log(
        'gameStepsWithVisitorSelectedValues',
        gameStepsWithVisitorSelectedValues
    );

    if (
        localStorage.getItem(state.activeGame?._id) === 'done' ||
        state.activeGame?.game_type === 'SHOP'
    ) {
        alert('Uus faas pole veel alanud. Proovi varsti uuesti');
        location.reload();
    } else {
        console.log('Active game: ', state.activeGame);
        if (localStorage.getItem(state.activeGame?._id) === null) {
            console.log('Game not started I think...?');
        } else {
            console.log('visitor.quiz_results', visitor.quiz_results);
        }
        console.log(visitor.quiz_results);
        state.current_step =
            gameStepsWithVisitorSelectedValues[state.step_counter];
    }
    localStorage.setItem(state.activeGame?._id, 'started');

    step(1);
}

// watch(state, async () => {
//     visitor = await visitorStore.fetchVisitor(
//         localStorage.getItem('visitorId')
//     );
// });

function quizIsDone() {
    console.log(state.activeGame);
    localStorage.setItem(state.activeGame?._id, 'done');
    location.reload();
}

async function selectValue(val) {
    console.log('seda tahan_>', val);
    console.log('seda tahan_>', val.option_text);
    state.visitor_current_step_selected_option_text = val.option_text;

    let updateVisitor = ref(stateVIsitor);
    console.log(updateVisitor);
    console.log(state.current_step);
    let stepToUpdate = updateVisitor.value.quiz_results.find(
        (qR) => qR.step._id === state.current_step._id
    );
    console.log(stepToUpdate);
    stepToUpdate.result_text = val.option_text;
    stepToUpdate.result_humanity_values = val.humanity_values;
    stateVIsitor = await visitorStore.editVisitor(updateVisitor.value);
    // step(1);
}

function step(i) {
    state.game_loading = false;
    state.game_started = true;
    state.step_counter += i;
    // if (state.step_counter < gameStepsWithVisitorSelectedValues.length) {
    console.log(gameStepsWithVisitorSelectedValues[0]);
    state.current_step =
        gameStepsWithVisitorSelectedValues[state.step_counter].step;
    // } else {
    // state.last_step = true;
    // console.log('bro midagi katki');
    // }
    state.visitor_current_step_selected_option_text = ref(
        gameStepsWithVisitorSelectedValues.find(
            (qr) => qr.step._id === state.current_step._id
        )?.result_text
    );
    console.log(
        'state.visitor_current_step_selected_option_text _________ ',
        state.visitor_current_step_selected_option_text
    );
}
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
            class="d-flex align-items-center w-100 h-100 justify-content-center flex-column"
        >
            <button class="w-75 btn btn-primary" @click="startGame">
                Alusta
            </button>
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
                current step - {{ state.current_step }} <br /><br />
                eem -
                {{ gameStepsWithVisitorSelectedValues[state.step_counter] }}
                <div class="buttons">
                    <button class="btn btn-outline-primary" @click="step(-1)">
                        eelmine
                    </button>
                    <!--            <span-->
                    <!--                >{{ state.step_counter + 1 }} /-->
                    <!--                {{-->
                    <!--                    activeGame?.game_steps ? activeGame?.game_steps?.length : 0-->
                    <!--                }}</span-->
                    <!--            >-->
                    <button class="btn btn-primary" @click="step(1)">
                        jargmine
                    </button>
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
