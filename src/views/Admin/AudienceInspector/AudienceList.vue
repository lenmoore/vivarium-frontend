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
let showOnlyColor = ref(router.currentRoute.value.query.color);
console.log(showOnlyColor);
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

console.log(visitors);
let allProductsEverSelected = ref([]);
let countedProducts = ref([]);
let mappedVisitors = ref([]);
watch(visitors, async () => {
    let visitorsToMap = [];

    if (showOnlyColor.value) {
        console.log(showOnlyColor);
        visitorsToMap = ref(
            visitors.value.filter(
                (visitor) =>
                    visitor.confirmed_humanity_value === showOnlyColor.value
            )
        );
    } else {
        visitorsToMap = ref(visitors.value);
    }
    console.log(visitorsToMap);
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
    await getQuizResults(mappedVisitors);
});
let quizResults = ref([]);
let allAnswers = ref([]);

async function getQuizResults(visitores) {
    console.log('hello');
    console.log(visitores.length);
    visitores.forEach((visitor) => {
        console.log('visitor', visitor);
        visitor.quiz_results.forEach((p) => {
            allAnswers.value.push(p);
        });
    });

    visitores.forEach((product) => {
        let count = allAnswers.value.filter(
            (p) => p._id === product._id
        ).length;
        if (
            !quizResults.value.find(
                (cP) => cP.option_text === product.option_text
            )
        ) {
            quizResults.value.push({ ...product, count: count });
        }
    });

    viewOptions.value.ready = true;
    console.log(quizResults);
}

async function confirmColors() {
    visitors = visitors.value.map((visitor) => ({
        ...visitor,
        confirmed_humanity_value: visitor.highest.color,
    }));
    console.log(visitors);
    await performanceStore.updateVisitors(visitors);
    location.reload();
}

async function getProducts(visitores) {
    console.log('hello');
    console.log(visitores.length);
    visitores.forEach((visitor) => {
        console.log('visitor', visitor);
        visitor.basket?.products?.forEach((p) => {
            allProductsEverSelected.value.push(p);
        });
    });

    products.value.forEach((product) => {
        let count = allProductsEverSelected.value.filter(
            (p) => p._id === product._id
        ).length;
        if (!countedProducts.value.find((cP) => cP._id === product._id)) {
            countedProducts.value.push({ ...product, count: count });
        }
    });

    viewOptions.value.ready = true;
}
</script>

<template>
    <div class="my-4">
        <small>Publiku filter</small> <br />
        <RouterLink :to="{ name: 'admin.audience' }" class="mx-2"
            >Publik kõik
        </RouterLink>
        <RouterLink
            :class="{ 'font-size-xl': showOnlyColor === 'blue-sky' }"
            :to="{ name: 'admin.audience', query: { color: 'blue-sky' } }"
            class="mx-2"
            style="background-color: paleturquoise"
        >
            Publik türkiis
        </RouterLink>

        <RouterLink
            :class="{ 'font-size-xl': showOnlyColor === 'fuchsia' }"
            :to="{ name: 'admin.audience', query: { color: 'fuchsia' } }"
            class="mx-2 link"
            style="background-color: lightpink"
        >
            Publik violett
        </RouterLink>

        <RouterLink
            :class="{ 'font-size-xl': showOnlyColor === 'silver' }"
            :to="{ name: 'admin.audience', query: { color: 'silver' } }"
            class="mx-2 link"
            style="background-color: silver"
        >
            Publik hõbevalge
        </RouterLink>

        <RouterLink
            :class="{ 'font-size-xl': showOnlyColor === 'lime' }"
            :to="{ name: 'admin.audience', query: { color: 'lime' } }"
            class="mx-2 link"
            style="background-color: lime"
        >
            Publik laim
        </RouterLink>

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
                        class="visitor-wrapper mt-2"
                    >
                        <h6>Garderoobinumber: {{ visitor.wardrobe_number }}</h6>
                        Tooteid korvis: {{ visitor.basket.products.length }},
                        {{
                            visitor.confirmed_humanity_value ||
                            (visitor.highest && visitor.highest.color)
                        }}
                        <!--                        <br /><small style="font-size: 10px">{{-->
                        <!--                            visitor.avg_hum_values-->
                        <!--                        }}</small>-->

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
                    <!--                    Poes oli kokku tooteid {{ products.length }}. Kokku toodi-->
                    <!--                    {{ showOnlyColor }} kapslisse-->
                    <!--                    {{ allProductsEverSelected.length }} toodet.-->
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
                    <small class="text-white bg-black"
                        >Helena paneb siia loendatud tulemused ka siis kui
                        jouab. Prg nii v2he et :D
                    </small>
                    <div
                        v-for="visitor in mappedVisitors"
                        :key="'visitor' + visitor._id"
                        class="border"
                    >
                        <div
                            v-for="quizAnswer in visitor.quiz_results"
                            :key="visitor._id + quizAnswer._id"
                        >
                            {{ quizAnswer.result_text }}
                        </div>
                    </div>
                </div>
            </div>

            <h4 style="margin-top: 20rem">
                Ära vajuta neid nuppe, kui sul siia asja pole. Helena paneb need
                hiljem peitu
            </h4>
            <div>
                <button class="btn btn-primary" @click="confirmColors">
                    pane värvid lukku
                </button>
            </div>
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
