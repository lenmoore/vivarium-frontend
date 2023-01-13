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
    await performanceStore.getGames();

    games = computed(() => performanceStore.games);
    phases = computed(() => performanceStore.phases);
    await sort();
    isLoading.value = false;
});

async function sort() {
    phases = computed(() => performanceStore.phases);
    games = computed(() => performanceStore.games);
    console.log(games);
    let sortedVisitors = computed(() => performanceStore.getVisitors);

    sortedVisitors.value.forEach((visitor) => {
        visitor.quiz_results.forEach((qR) => {
            if (qR.result_text !== '-') {
                allAnswers.value.push(qR);
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
    console.log('make this inactive: ', phaseToEdit);
    await performanceStore.editPhase(phaseToEdit);
    location.reload();
}

setInterval(async function () {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    instance?.proxy?.$forceUpdate();
}, 120000);
</script>
<template>
    <div>
        <div v-if="isLoading">
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
                    <h4>{{ step.question_text }}</h4>
                    <div
                        v-for="option in step.question_options"
                        :key="option.option_text"
                    >
                        {{ option.option_text }}
                        <span
                            >({{
                                allAnswers.filter(
                                    (ans) =>
                                        ans.step &&
                                        ans.step._id === step._id &&
                                        ans.result_text === option.option_text
                                ).length
                            }})</span
                        >
                    </div>
                </div>
            </div>
            <div class="col-3 d-flex justify-content-end align-items-start">
                <button
                    :class="
                        getGameActiveButton(game) === 'Aktiveeri'
                            ? 'btn-outline-primary'
                            : 'btn-primary'
                    "
                    class="btn"
                    @click.prevent="activateQuestionnaire(game)"
                >
                    {{ getGameActiveButton(game) }}
                </button>
            </div>
        </div>
    </div>
</template>
