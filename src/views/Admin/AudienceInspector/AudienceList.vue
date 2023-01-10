<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onBeforeMount, ref, reactive, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';
import AudienceSummary from './AudienceSummary.vue';
import { cloneDeep } from 'lodash';
import ProductsSummary from './ProductsSummary.vue';
import QuizSummary from './QuizSummary.vue';

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
let activePerformance = {};
onBeforeMount(async () => {
    await performanceStore.getPerformances();
    activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    await humanityStore.fetchProducts();

    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance.value._id
    );
});

const baskets = computed(() => humanityStore.getBaskets);
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

let countedProducts = ref([]);
let mappedVisitors = reactive([]);
let coolAlgorithmedVisitors = reactive({});

watch(visitors, async () => {
    await sortThemGuys();
});

async function sortThemGuys() {
    coolAlgorithmedVisitors = reactive({});
    let visitorsToMap = ref(visitors.value);
    countedProducts = ref([]);
    mappedVisitors = reactive([]);
    coolAlgorithmedVisitors = {
        turq: new Set(),
        fuchsia: new Set(),
        silver: new Set(),
        lime: new Set(),
    };

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
            lime: lime?.reduce((a, b) => a + b, 0),
            fuchsia: fuchsia?.reduce((a, b) => a + b, 0),
            silver: silver?.reduce((a, b) => a + b, 0),
            turq: turq?.reduce((a, b) => a + b, 0),
        };
        let maxKey,
            maxValue = 0;

        for (const [key, value] of Object.entries(avg_hum_values)) {
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        }
        let highest = maxKey;

        return {
            ...visitor,
            basket,
            highest,
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
    let peopleCountModulo = visitors.value.length % 4;

    let peopleCount = (visitors.value.length - peopleCountModulo) / 4;
    let notYetSomewhere = new Set(mappedVisitors);

    console.log(notYetSomewhere.size, ' not yet somewhere');
    dividePeople();

    function dividePeople() {
        console.log(
            visitors.value.length,
            '%',
            peopleCount,
            '=',
            peopleCountModulo
        );
        console.log(mappedVisitors);

        while (notYetSomewhere.size) {
            console.log(notYetSomewhere.size, ' not yet somewhere');
            notYetSomewhere.forEach((silverGuy) => {
                let maxKey = '';
                let maxValue = 0;
                for (const [key, value] of Object.entries(
                    silverGuy.avg_hum_values
                )) {
                    if (value > maxValue) {
                        maxValue = value;
                        maxKey = key;
                    }
                }
                console.log(peopleCount + peopleCountModulo, 'max size');
                console.log(coolAlgorithmedVisitors[maxKey].size);
                notYetSomewhere.delete(silverGuy);
            });
        }
    }

    function addToAlgorithmedVisitors(maxKey, visitor) {
        coolAlgorithmedVisitors[maxKey].add(visitor);
        notYetSomewhere.delete(visitor);
    }

    console.log(notYetSomewhere);

    viewOptions.value.ready = true;
}

async function confirmColors() {
    let viiiiis = [];

    coolAlgorithmedVisitors.lime.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'lime',
        });
        // }
    });
    coolAlgorithmedVisitors.silver.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'silver',
        });
        // }
    });
    coolAlgorithmedVisitors.turq.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'turq',
        });
        // }
    });
    coolAlgorithmedVisitors.fuchsia.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'fuchsia',
        });
        // }
    });

    await performanceStore.updateVisitors(viiiiis);
    // location.reload();
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
                    Kõik
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showProductsSummary,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('products')"
                >
                    Tooted kaasas
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showQuizSummaryPreCapsule,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-pre-capsule')"
                >
                    2. ja 3. mäng
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            viewOptions.showQuizSummaryInCapsule,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-in-capsule')"
                >
                    Kapslimängud
                </button>
            </div>
            <div v-if="viewOptions.ready">
                <div v-if="viewOptions.showSummaryList" class="visitors">
                    {{ visitors.length }} inimest teatris. Eeldatav kapsli
                    suurus: {{ Math.floor(visitors.length / 4) }} +- 3
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
                    <QuizSummary
                        :color="showOnlyColorRoute || showOnlyColor"
                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"
                        :games="gamesInCapsule"
                    />
                </div>
                <div v-else-if="viewOptions.showQuizSummaryPreCapsule">
                    <QuizSummary
                        :color="showOnlyColorRoute || showOnlyColor"
                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"
                        :games="gamesPreCapsule"
                    />
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
