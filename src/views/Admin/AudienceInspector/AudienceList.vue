<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onBeforeMount, ref, reactive, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();

let viewOptions = ref({
    showSummaryList: true,
    showProductsSummary: false,
    showQuizSummary: false,
    ready: false,
});
onBeforeMount(async () => {
    await performanceStore.getGames();
    await humanityStore.fetchBaskets();
    await performanceStore.getPerformances();
    const activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance.value._id
    );
});

const baskets = computed(() => humanityStore.getBaskets);
const products = computed(() => humanityStore.getProducts);
let games = computed(() => performanceStore.games);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color);
let visitors = computed(() => performanceStore.getVisitors);

function toggleViewOptions(show) {
    viewOptions.value.showSummaryList = false;
    viewOptions.value.showProductsSummary = false;
    viewOptions.value.showQuizSummary = false;

    switch (show) {
        case 'products':
            viewOptions.value.showProductsSummary = true;
            break;
        case 'quiz':
            viewOptions.value.showQuizSummary = true;
            break;
        case 'audience':
        default:
            viewOptions.value.showSummaryList = true;
            break;
    }
}

let allProductsEverSelected = ref([]);
let countedProducts = ref([]);
let mappedVisitors = ref([]);
watch(visitors, async () => {
    let visitorsToMap = [];

    if (showOnlyColorRoute.value) {
        visitorsToMap = ref(
            visitors.value.filter(
                (visitor) =>
                    visitor.confirmed_humanity_value ===
                    showOnlyColorRoute.value
            )
        );
    } else {
        visitorsToMap = ref(visitors.value);
    }
    mappedVisitors = visitorsToMap.value?.map((visitor) => {
        let basket = visitor.basket;

        let redQuiz = visitor.quiz_results
            ? visitor?.quiz_results
                  ?.map((qR) => {
                      if (qR?.result_humanity_values?.fuchsia) {
                          return qR.result_humanity_values?.fuchsia;
                      }
                      return qR.result_humanity_values?.red;
                  })
                  ?.reduce((a, b) => a + b)
            : [];
        let greenQuiz = visitor.quiz_results
            ? visitor?.quiz_results
                  ?.map((qR) => {
                      return qR?.result_humanity_values?.green;
                  })
                  ?.reduce((a, b) => a + b)
            : [];
        let blueQuiz = visitor.quiz_results
            ? visitor?.quiz_results
                  ?.map((qR) => {
                      return qR?.result_humanity_values?.blue;
                  })
                  ?.reduce((a, b) => a + b)
            : [];
        let orangeQuiz = visitor.quiz_results
            ? visitor?.quiz_results
                  ?.map((qR) => {
                      return qR?.result_humanity_values?.orange;
                  })
                  ?.reduce((a, b) => a + b)
            : [];
        let avg_hum_values = [
            {
                color: 'fuchsia',
                val:
                    basket.products
                        .map((p) => p.humanity_values?.fuchsia?.average)
                        .reduce((a, b) => a + b) + redQuiz,
            },
            {
                color: 'lime',
                val:
                    basket.products
                        .map((p) => p.humanity_values.green.average)
                        .reduce((a, b) => a + b) + greenQuiz,
            },
            {
                color: 'silver',
                val:
                    basket.products
                        .map((p) => p.humanity_values.blue.average)
                        .reduce((a, b) => a + b) + blueQuiz,
            },
            {
                color: 'blue-sky',
                val:
                    basket.products
                        .map((p) => p.humanity_values.orange.average)
                        .reduce((a, b) => a + b) + orangeQuiz,
            },
        ];
        visitor.quiz_results.forEach((p) => {
            allAnswers.value.push(p);
        });
        if (visitor.confirmed_humanity_value !== 'none') {
            return {
                ...visitor,
                basket,
                avg_hum_values,
            };
        }
        let highest = avg_hum_values.find(
            (value) =>
                value.val === Math.max(...avg_hum_values.map((o) => o.val))
        );
        return {
            ...visitor,
            basket,
            avg_hum_values,
            highest,
        };
    });
    await getProducts(mappedVisitors);
    await performanceStore.getGames();
    games = computed(() => performanceStore.games);
    let color = {
        'blue-sky': 'orange',
        fuchsia: 'fuchsia',
        silver: 'blue',
        lime: 'green',
    }[showOnlyColorRoute.value || 'all'];
    console.log(games);
    games = games.value.filter(
        (g) =>
            g.open_for_colors.includes(color) && g.open_for_colors.length === 1
    );
});
let allAnswers = ref([]);

async function confirmColors() {
    visitors = visitors.value.map((visitor) => ({
        ...visitor,
        confirmed_humanity_value: visitor.highest.color,
    }));
    await performanceStore.updateVisitors(visitors);
    location.reload();
}

async function getProducts(visitores) {
    visitores.forEach((visitor) => {
        visitor.basket?.products?.forEach((p) => {
            allProductsEverSelected.value.push(p);
        });
    });

    products.value.forEach((product) => {
        let count = allProductsEverSelected.value.filter(
            (p) => p._id === product._id
        ).length;
        if (!countedProducts?.value?.find((cP) => cP._id === product._id)) {
            countedProducts.value.push({ ...product, count: count });
        }
    });

    countedProducts = countedProducts.value.sort((a, b) => b.count - a.count);
    viewOptions.value.ready = true;
}
</script>

<template>
    <div class="my-4">
        <RouterLink :to="{ name: 'admin.audience' }" class="mx-2"
            >Publik kõik
        </RouterLink>
        <br />
        <div class="d-flex justify-content-around align-items-center">
            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'blue-sky' }"
                :to="{ name: 'admin.audience', query: { color: 'blue-sky' } }"
                class="mx-2 p-2"
                style="background-color: paleturquoise"
            >
                Türkiis
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'fuchsia' }"
                :to="{ name: 'admin.audience', query: { color: 'fuchsia' } }"
                class="mx-2 p-2"
                style="background-color: lightpink"
            >
                Violett
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'silver' }"
                :to="{ name: 'admin.audience', query: { color: 'silver' } }"
                class="mx-2 p-2"
                style="background-color: silver"
            >
                Hõbevalge
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'lime' }"
                :to="{ name: 'admin.audience', query: { color: 'lime' } }"
                class="mx-2 p-2"
                style="background-color: lime"
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
                    K6ik tooted
                </button>
                <button
                    :class="{
                        'bg-success text-white': viewOptions.showQuizSummary,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz')"
                >
                    K6ik quizi vastused
                </button>
            </div>

            <div v-if="viewOptions.ready">
                <div v-if="viewOptions.showSummaryList" class="visitors">
                    <div
                        v-for="visitor in mappedVisitors"
                        :key="visitor._id"
                        :class="
                            (visitor.highest && visitor.highest.color) ||
                            visitor.confirmed_humanity_value
                        "
                        class="visitor-wrapper mt-2 text-center"
                    >
                        <h5>Garderoobinumber: {{ visitor.wardrobe_number }}</h5>
                        Tooteid korvis: {{ visitor.basket.products.length }},
                        {{
                            visitor.confirmed_humanity_value ||
                            (visitor.highest && visitor.highest.color)
                        }}

                        <div class="border-top">
                            Korvis:
                            <small
                                v-for="product in visitor.basket.products"
                                :key="product.title"
                                >{{ product.title }},
                            </small>
                        </div>
                    </div>
                </div>
                <div
                    v-else-if="
                        viewOptions.showProductsSummary && countedProducts
                    "
                >
                    <div>
                        <div
                            v-for="product in countedProducts"
                            :key="product._id"
                        >
                            <div
                                v-if="product.count > 0"
                                class="d-flex m-1 p-1 align-items-center"
                            >
                                <img :src="product.image" alt="" height="100" />
                                <h4 class="m-1 p-1">
                                    {{ product.count }} x
                                    {{ product.title }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="viewOptions.showQuizSummary">
                    <div v-for="(game, i) in games" :key="game._id + i">
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
                                                    option.option_text
                                            ).length
                                        }})</strong
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--            <h4 style="margin-top: 20rem">-->
            <!--                Ära vajuta neid nuppe, kui sul siia asja pole. Helena paneb need-->
            <!--                hiljem peitu-->
            <!--            </h4>-->
            <!--            <div>-->
            <!--                <button class="btn btn-primary" @click="confirmColors">-->
            <!--                    pane värvid lukku-->
            <!--                </button>-->
            <!--            </div>-->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fuchsia,
.silver,
.blue-sky,
.lime {
    &.router-link-exact-active {
        font-size: 2rem;
    }
}
</style>
