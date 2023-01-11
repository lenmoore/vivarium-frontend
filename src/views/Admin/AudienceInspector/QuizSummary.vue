<script setup>
import { computed, defineProps, onBeforeMount, onMounted, ref } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import { getCurrentInstance } from 'vue';
import router from '../../../router/index';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let showOnlyColorRoute = ref(router.currentRoute.value.query.color || 'all');
let showOnlyColor = ref(localStorage.getItem('actor_color'));
let preCapsule =
    router.currentRoute.value.name === 'admin.audience.quiz-pre-capsule';

console.log(preCapsule.value);
let games = ref([]);

let mappedGames = [];
const allAnswers = ref([]);
onMounted(async () => {
    await performanceStore.getActorCapsuleVisitors(
        showOnlyColorRoute.value || showOnlyColor
    );
    await performanceStore.getGames();

    games = computed(() => performanceStore.games);

    await sort();
});

async function sort() {
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
    console.log('games-', games);
    instance?.proxy?.$forceUpdate();
}

setInterval(async function () {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    instance?.proxy?.$forceUpdate();
}, 120000);
</script>
<template>
    <div>
        <div
            v-for="(game, i) in games"
            :key="game._id + i"
            class="border my-2 p-4"
        >
            <div>
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
                        <strong
                            >({{
                                allAnswers.filter(
                                    (ans) =>
                                        ans.step &&
                                        ans.step._id === step._id &&
                                        ans.result_text === option.option_text
                                ).length
                            }})</strong
                        >
                    </div>
                </div>
            </div>
        </div>
        {{ allAnswers[0] }}
    </div>
</template>
