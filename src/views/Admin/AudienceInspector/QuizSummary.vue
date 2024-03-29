<script setup>
import { computed, defineProps, onBeforeMount, onMounted, ref } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let showOnlyColorRoute = ref(router.currentRoute.value.query.color || 'all');
let showOnlyColor = ref(localStorage.getItem('actor_color'));
let preCapsule =
    router.currentRoute.value.name === 'admin.audience.quiz-pre-capsule';

console.log(preCapsule.value);
let games = ref([]);
let phases = ref([]);
let isLoading = ref(false);

let mappedGames = [];
const allAnswers = ref([]);
onMounted(async () => {
    isLoading.value = true;
    await performanceStore.getActorCapsuleVisitors(
        showOnlyColorRoute.value || showOnlyColor
    );
    // await performanceStore.getGames();

    games = computed(() => performanceStore.games);
    phases = computed(() => performanceStore.phases);
    await sort();
    isLoading.value = false;
});

async function sort() {
    phases = computed(() => performanceStore.phases);
    games = computed(() => performanceStore.games);
    let sortedVisitors = computed(() => performanceStore.getVisitors);

    sortedVisitors.value.forEach((visitor) => {
        visitor.quiz_results.forEach((qR) => {
            if (qR.result_text !== '-') {
                allAnswers.value.push({
                    ...qR,
                    visitor: visitor.wardrobe_number,
                });
            }
        });
    });
    games = games?.value?.filter(
        (g) =>
            g.game_type !== 'SHOP' &&
            g.pre_capsule === preCapsule &&
            (g.open_for_colors.includes(showOnlyColorRoute.value) ||
                g.open_for_colors.includes(showOnlyColor))
    );

    instance?.proxy?.$forceUpdate();
}

function getGameActiveButton(game) {
    const phases = computed(() => performanceStore.phases);
    let phaseToEdit = phases?.value?.find(
        (p) => p?.phase_game?._id === game?._id
    );
    return phaseToEdit?.active ? 'Lopeta' : 'Aktiveeri';
}

let gameClicked = ref(false);

async function activateQuestionnaire(game) {
    gameClicked = true;
    const phases = computed(() => performanceStore.phases);
    let phaseToEdit = phases.value.find((p) => p.phase_game._id === game._id);
    await performanceStore.editPhase(phaseToEdit);
    location.reload();
}

setInterval(async function () {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    instance?.proxy?.$forceUpdate();
}, 120000);

function getGameStepObj(step) {
    let stepAnswers = allAnswers.value.filter(
        (ans) => ans.step && ans.step._id === step._id
    );

    let mappedAnswers = step.question_options
        .map((opt) => ({
            text: opt.option_text,
            amount: stepAnswers.filter(
                (ans) =>
                    ans.step &&
                    ans.step._id === step._id &&
                    ans.result_text === opt.option_text
            ).length,
            visitors: stepAnswers
                .filter(
                    (ans) =>
                        ans.step &&
                        ans.step._id === step._id &&
                        ans.result_text === opt.option_text
                )
                .map((ans) => ans.visitor),
        }))
        .sort((a, b) => a.text.localeCompare(b.text));

    let stepObject = {
        _id: step._id,
        question_text: step.question_text,
        results: mappedAnswers,
        peopleWhoAnswered: stepAnswers.length,
    };

    return stepObject;
}
</script>
<template>
    <div>
        <div v-if="isLoading" class="d-flex justify-content-center">
            <img alt="loader" src="/public/Spinner-1s-200px.gif" />
        </div>
        <div
            v-for="(game, i) in games"
            :key="game._id + i"
            class="border my-2 p-4 row"
        >
            <div class="col-12">{{ game.name }}</div>
            <div class="col-9">
                <div
                    v-for="step in game.game_steps"
                    :key="step._id"
                    class="py-2"
                >
                    <h4>{{ getGameStepObj(step).question_text }}</h4>
                    (vastanud: {{ getGameStepObj(step).peopleWhoAnswered }})

                    <div
                        v-for="option in getGameStepObj(step).results"
                        :key="option.text"
                        class="w-100 border-bottom d-flex align-items-center justify-content-between py-1"
                    >
                        <div class="w-75">
                            <div class="py-1" style="font-size: 1.2rem">
                                - {{ option.text }}
                            </div>
                            <div class="fst-italic">{{ option.visitors }}</div>
                        </div>
                        <div>
                            <small
                                >({{
                                    Math.floor(
                                        (option.amount /
                                            getGameStepObj(step)
                                                .peopleWhoAnswered) *
                                            100
                                    )
                                }}
                                %)</small
                            >
                            -
                            <strong>{{ option.amount }}</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3 d-flex justify-content-end align-items-start">
                <div v-if="gameClicked">Laen...</div>
                <button
                    v-else
                    :class="
                        getGameActiveButton(game) === 'Aktiveeri'
                            ? 'btn-outline-primary'
                            : 'btn-primary'
                    "
                    class="btn font-size-xl"
                    @click.prevent="activateQuestionnaire(game)"
                >
                    {{ getGameActiveButton(game) }}
                </button>
            </div>
        </div>
    </div>
</template>
