<script setup>
import { usePerformanceStore } from '../../store/performance.store';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useVisitorStore } from '../../store/visitor.store';
import router from '../../router/index';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();

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
let updateVisitor = {};
onBeforeMount(async () => {
    // await performanceStore.getGames();
    state.game_loading = true;
    await performanceStore.getPhases();
    // await performanceStore.getPerformances();
    stateVIsitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );

    const phases = reactive(performanceStore.phases);
    let activePhase = reactive(
        phases.find(
            (p) =>
                p.active &&
                (stateVIsitor.confirmed_humanity_value === 'none' ||
                    p.phase_game?.open_for_colors?.includes(
                        stateVIsitor?.confirmed_humanity_value
                    ))
        )
    );
    let games = reactive(performanceStore.games);
    console.log(games);
    state.active_game = games.find(
        (game) =>
            game?._id === activePhase?.phase_game?._id &&
            game.open_for_colors.includes(stateVIsitor.confirmed_humanity_value)
    );
    gameStepsWithVisitorSelectedValues = ref(stateVIsitor.quiz_results);
    gameStepsWithVisitorSelectedValues =
        gameStepsWithVisitorSelectedValues.value.filter(
            (qr) => qr.game === state.active_game._id
        );

    console.log(gameStepsWithVisitorSelectedValues);

    updateVisitor = ref(stateVIsitor);
    state.game_loading = false;
});
let visitor = stateVIsitor;

let colors = {
    turq: 'orange',
    fuchsia: 'fuchsia',
    silver: 'blue',
    lime: 'green',
};

// todo this is a little hack for determining the correct color capsule game when in the capsule, the check should be stricter and come from the store.

async function startGame() {
    console.log('active game id', state?.active_game?._id);
    state.last_step = false;
    state.step_counter = 0;
    state.game_loading = true;

    if (
        localStorage.getItem(state.active_game?._id) === 'done' ||
        state.active_game?.game_type === 'SHOP'
    ) {
        alert('Uus faas pole veel alanud. Proovi varsti uuesti');
    } else {
        console.log('Active game: ', state.active_game);
        if (localStorage.getItem(state.active_game?._id) !== null) {
            console.log('visitor.quiz_results', visitor.quiz_results);
        }
    }
    state.current_step = gameStepsWithVisitorSelectedValues[state.step_counter];
    localStorage.setItem(state.active_game?._id, 'started');
    console.log(state.current_step);
    state.game_loading = false;
    step(0);
}

async function selectValue(val) {
    stateVIsitor = await visitorStore.fetchVisitor(
        localStorage.getItem('visitorId')
    );
    state.visitor_current_step_selected_option_text = val.option_text;

    updateVisitor = ref(stateVIsitor);
    let stepToUpdate = updateVisitor.value.quiz_results.find(
        (qR) => qR?.step?._id === state?.current_step?._id
    );

    stepToUpdate.result_text = val.option_text;
    stepToUpdate.result_humanity_values = val.humanity_values;
    gameStepsWithVisitorSelectedValues[state.step_counter] = stepToUpdate;
    await visitorStore.updateQuizResult(stepToUpdate);
    localStorage.setItem('visitor', stateVIsitor);

    instance?.proxy?.$forceUpdate();
}

function step(i) {
    state.game_loading = false;
    state.game_started = true;
    state.step_counter += i;
    console.log(state.step_counter);
    if (state.step_counter < gameStepsWithVisitorSelectedValues.length) {
        state.current_step =
            gameStepsWithVisitorSelectedValues[state.step_counter].step;
        console.log(state.current_step);
        state.current_step.question_options =
            state.current_step.question_options.sort((a, b) =>
                a.option_text.localeCompare(b.option_text)
            );
        console.log(state);
    } else {
        state.last_step = true;
        localStorage.setItem(state.active_game._id, 'done');
    }
    state.visitor_current_step_selected_option_text = ref(
        gameStepsWithVisitorSelectedValues.find(
            (qr) => qr.step._id === state.current_step._id
        )?.result_text
    );
}

watch(state.last_step, () => {
    if (
        state.last_step === true &&
        localStorage.getItem(state.active_game._id) === 'done'
    ) {
        setTimeout(async () => {
            await performanceStore.getPhases();
            window.location.reload();
        }, 12000);
    }
});
</script>
<template>
    <div v-if="state.game_loading" class="d-flex justify-content-center">
        <img alt="loader" src="/public/Spinner-1s-200px.gif" />
    </div>
    <div
        v-else
        class="h-100 d-flex flex-column overflow-scroll justify-content-between w-100 align-content-around"
    >
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
                            state.current_step.question_text.length > 1
                                ? state.current_step.question_text
                                : 'Millega nõustud kõige rohkem?'
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

                <div class="buttons">
                    <button
                        v-if="state.step_counter !== 0"
                        class="btn btn-outline-primary"
                        @click="step(-1)"
                    >
                        eelmine
                    </button>
                    <!--            <span-->
                    <!--                >{{ state.step_counter + 1 }} /-->
                    <!--                {{-->
                    <!--                    active_game?.game_steps ? active_game?.game_steps?.length : 0-->
                    <!--                }}</span-->
                    <!--            >-->
                    <button class="btn btn-primary" @click="step(1)">
                        jargmine
                    </button>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <span
                        >{{ state.step_counter + 1 }} /
                        {{
                            state.active_game &&
                            state.active_game.game_steps.length
                        }}</span
                    >
                </div>
            </div>
            <div v-else>Valmis. Oota edasisi juhiseid.</div>
        </div>
    </div>
</template>

<style lang="scss">
.option {
    border: 1px solid black;
    margin-bottom: 1rem;
    padding: 0.5rem;

    &:active {
        transform: translateY(4px);
        transition: 0.3s right;
    }
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
    transition: 0.3s right;
}
</style>
