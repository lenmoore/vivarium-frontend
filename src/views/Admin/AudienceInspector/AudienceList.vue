<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onBeforeMount, ref, reactive, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';
import AudienceSummary from './AudienceSummary.vue';
import { cloneDeep } from 'lodash';
import ProductsSummary from './ProductsSummary.vue';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();

const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');

let viewOptions = ref({
    showSummaryList: true,
    showProductsSummary: false,
    showQuizSummaryInCapsule: false,
    showQuizSummaryPreCapsule: false,
    ready: false,
});
onBeforeMount(async () => {
    await performanceStore.getPerformances();
    const activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    await humanityStore.fetchProducts();

    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance.value._id
    );
});

const baskets = computed(() => humanityStore.getBaskets);
const products = computed(() => humanityStore.getProducts);
let games = computed(() => performanceStore.games);
let gamesPreCapsule = computed(() => performanceStore.games);
let gamesInCapsule = computed(() => performanceStore.games);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color);
let showOnlyColor = ref(localStorage.getItem('actor_color'));

let visitors = computed(() => performanceStore.getVisitors);

function toggleViewOptions(show) {
    viewOptions.value.showSummaryList = false;
    viewOptions.value.showProductsSummary = false;
    viewOptions.value.showQuizSummaryPreCapsule = false;
    viewOptions.value.showQuizSummaryInCapsule = false;

    switch (show) {
        case 'products':
            viewOptions.value.showProductsSummary = true;
            break;
        case 'quiz-in-capsule':
            viewOptions.value.showQuizSummaryInCapsule = true;
            break;
        case 'quiz-pre-capsule':
            viewOptions.value.showQuizSummaryPreCapsule = true;
            break;
        case 'audience':
        default:
            viewOptions.value.showSummaryList = true;
            break;
    }
}

let allProductsEverSelected = ref([]);
let countedProducts = ref([]);
let mappedVisitors = reactive([]);
let coolAlgorithmedVisitors = reactive({});
let allAnswers = ref([]);

watch(visitors, async () => {
    await sortThemGuys();
});

async function sortThemGuys() {
    let visitorsToMap = ref(visitors.value);
    allProductsEverSelected = ref([]);
    countedProducts = ref([]);
    mappedVisitors = reactive([]);
    coolAlgorithmedVisitors = {
        turq: new Set(),
        fuchsia: new Set(),
        silver: new Set(),
        lime: new Set(),
    };
    allAnswers = ref([]);

    mappedVisitors = visitorsToMap.value.map((visitor) => {
        let basket = visitor.basket;

        let redQuiz = visitor?.quiz_results
            ? visitor?.quiz_results?.map((qR) => {
                  return qR.result_humanity_values?.fuchsia;
              })
            : [];
        let greenQuiz = visitor?.quiz_results
            ? visitor?.quiz_results?.map((qR) => {
                  return qR?.result_humanity_values?.lime;
              })
            : [];
        let blueQuiz = visitor?.quiz_results
            ? visitor?.quiz_results?.map((qR) => {
                  return qR?.result_humanity_values?.silver;
              })
            : [];
        let orangeQuiz = visitor?.quiz_results
            ? visitor?.quiz_results?.map((qR) => {
                  return qR?.result_humanity_values?.turq;
              })
            : [];

        let redProducts = basket?.products?.map(
            (p) => p.humanity_values?.fuchsia?.average
        );
        let silverProducts = basket?.products?.map(
            (p) => p.humanity_values?.blue?.average
        );
        let limeProducts = basket?.products?.map(
            (p) => p.humanity_values?.green?.average
        );
        let turqProducts = basket?.products?.map(
            (p) => p.humanity_values?.orange?.average
        );

        let fuchsia = [...redQuiz, ...redProducts];
        let lime = [...greenQuiz, ...limeProducts];
        let silver = [...blueQuiz, ...silverProducts];
        let turq = [...orangeQuiz, ...turqProducts];

        let avg_hum_values = {
            lime: lime?.reduce((a, b) => a + b),
            fuchsia: fuchsia?.reduce((a, b) => a + b),
            silver: silver?.reduce((a, b) => a + b),
            turq: turq?.reduce((a, b) => a + b),
        };
        visitor.quiz_results.forEach((p) => {
            allAnswers.value.push(p);
        });
        return {
            ...visitor,
            basket,
            avg_hum_values,
        };
    });

    games = computed(() => performanceStore.games);
    gamesPreCapsule = games.value.filter(
        (g) => g.pre_capsule && g.game_type !== 'SHOP'
    );
    gamesInCapsule = games.value.filter(
        (g) => !g.pre_capsule && g.game_type !== 'SHOP'
    );

    let color = {
        turq: 'orange',
        fuchsia: 'fuchsia',
        silver: 'blue',
        lime: 'green',
    }[showOnlyColorRoute.value || 'all'];
    games = games.value.filter(
        (g) =>
            g.open_for_colors.includes(color) && g.open_for_colors.length === 1
    );
    let peopleCount = mappedVisitors.length / 4;

    // turq
    let sortedByTurq = mappedVisitors.sort(
        (a, b) => b.avg_hum_values?.turq - a.avg_hum_values?.turq
    );
    for (let i = 0; i < peopleCount; i++) {
        coolAlgorithmedVisitors.turq.add(sortedByTurq[i]);
    }

    // silver
    let sortedBySilver = mappedVisitors.sort(
        (a, b) => b.avg_hum_values?.silver - a.avg_hum_values?.silver
    );
    for (let i = 0; i < peopleCount; i++) {
        coolAlgorithmedVisitors.silver.add(sortedBySilver[i]);
    }

    // violet
    let sortedByFuchsia = mappedVisitors.sort(
        (a, b) => b.avg_hum_values?.fuchsia - a.avg_hum_values?.fuchsia
    );
    for (let i = 0; i < peopleCount; i++) {
        coolAlgorithmedVisitors.fuchsia.add(sortedByFuchsia[i]);
    }

    // lime
    let sortedByLime = mappedVisitors.sort(
        (a, b) => b.avg_hum_values?.lime - a.avg_hum_values?.lime
    );
    for (let i = 0; i < peopleCount; i++) {
        coolAlgorithmedVisitors.lime.add(sortedByLime[i]);
    }

    viewOptions.value.ready = true;
}

async function confirmColors() {
    // todo fix this
    location.reload();
}
</script>

<template>
    <div class="my-4">
        <div
            v-if="isAdmin"
            class="d-flex justify-content-around align-items-center"
        >
            <RouterLink :to="{ name: 'admin.audience' }" class="mx-2"
                >Publik kõik
            </RouterLink>
            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'turq' }"
                :to="{ name: 'admin.audience', query: { color: 'turq' } }"
                class="mx-2 p-2"
                style="background-color: paleturquoise"
                @click="sortThemGuys"
            >
                Türkiis
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'fuchsia' }"
                :to="{ name: 'admin.audience', query: { color: 'fuchsia' } }"
                class="mx-2 p-2"
                style="background-color: lightpink"
                @click="sortThemGuys"
            >
                Violett
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'silver' }"
                :to="{ name: 'admin.audience', query: { color: 'silver' } }"
                class="mx-2 p-2"
                style="background-color: silver"
                @click="sortThemGuys"
            >
                Hõbevalge
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'lime' }"
                :to="{ name: 'admin.audience', query: { color: 'lime' } }"
                class="mx-2 p-2"
                style="background-color: lime"
                @click="sortThemGuys"
            >
                Laim
            </RouterLink>
        </div>

        <div v-if="visitors && baskets">
            <div class="d-flex align-items-center justify-content-around">
                <button
                    :class="{
                        'bg-success text-white': viewOptions.showSummaryList,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('audience')"
                >
                    Publiku ulevaade
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showProductsSummary,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('products')"
                >
                    Tooted kapslis kaasas
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showQuizSummaryPreCapsule,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-pre-capsule')"
                >
                    Quizi vastused enne kapslit
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showQuizSummaryInCapsule,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-in-capsule')"
                >
                    Quizid kapslis
                </button>
            </div>

            <div v-if="viewOptions.ready">
                <div v-if="viewOptions.showSummaryList" class="visitors">
                    <AudienceSummary
                        :color="showOnlyColorRoute || showOnlyColor"
                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"
                    />
                </div>
                <div
                    v-else-if="
                        viewOptions.showProductsSummary && countedProducts
                    "
                >
                    <ProductsSummary
                        :color="showOnlyColorRoute || showOnlyColor"
                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"
                    />
                </div>
                <div v-else-if="viewOptions.showQuizSummaryInCapsule">
                    <div
                        v-for="(game, i) in gamesInCapsule"
                        :key="game._id + i"
                    >
                        <div
                            v-if="
                                game.open_for_colors.includes(showOnlyColor) ||
                                game.open_for_colors.includes(
                                    showOnlyColorRoute
                                )
                            "
                        >
                            <h1>{{ i }} {{ game.name }}</h1>
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
                                                    ans.result_text ===
                                                        option.option_text &&
                                                    ans.step === step._id
                                            ).length
                                        }})</strong
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="viewOptions.showQuizSummaryPreCapsule">
                    <div
                        v-for="(game, i) in gamesPreCapsule"
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
                                                    ans.result_text ===
                                                        option.option_text &&
                                                    ans.step === step._id
                                            ).length
                                        }})</strong
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isAdmin">
                <h4 style="margin-top: 20rem">
                    Ära vajuta neid nuppe, kui sul siia asja pole. Helena paneb
                    need hiljem peitu
                </h4>
                <div>
                    <button class="btn btn-primary" @click="confirmColors">
                        pane värvid lukku
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fuchsia,
.silver,
.turq,
.lime {
    &.router-link-exact-active {
        font-size: 2rem;
    }
}
</style>
