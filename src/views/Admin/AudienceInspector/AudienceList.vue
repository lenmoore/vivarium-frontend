<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onMounted, ref, reactive, watch } from 'vue';
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
onMounted(async () => {
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
let showOnlyColor = router.currentRoute.value.query.color;
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
watch(visitors, () => {
    let visitorsToMap = [];

    if (showOnlyColor) {
        console.log(showOnlyColor);
        visitorsToMap = ref(
            visitors.value.filter(
                (visitor) => visitor.confirmed_humanity_value === showOnlyColor
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
    getProducts(mappedVisitors);
});

function getProducts(visitores) {
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

async function confirmColors() {
    let visitors = mappedVisitors.value.map((visitor) => ({
        ...visitor,
        confirmed_humanity_value: visitor.highest.color,
    }));
    await performanceStore.updateVisitors(visitors);
    location.reload();
}
</script>

<template>
    <div>
        <div v-if="visitors && baskets">
            <div class="info-block border">
                Saalis inimesi: {{ mappedVisitors && mappedVisitors.length }}
                <br />
                <h2>Kapsel {{ showOnlyColor }}</h2>
            </div>
            <div class="d-flex align-items-center justify-content-around">
                <button
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('audience')"
                >
                    Publiku ulevaade
                </button>
                <button
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('products')"
                >
                    K6ik tooted
                </button>
                <button
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
                        class="visitor-wrapper"
                    >
                        <h6>Garderoobinumber: {{ visitor.wardrobe_number }}</h6>
                        Tooteid korvis: {{ visitor.basket.products.length }},
                        {{
                            visitor.confirmed_humanity_value ||
                            (visitor.highest && visitor.highest.color)
                        }}
                        <br /><small style="font-size: 10px">{{
                            visitor.avg_hum_values
                        }}</small>
                    </div>
                </div>
                <div
                    v-else-if="
                        viewOptions.showProductsSummary && countedProducts
                    "
                >
                    Poes oli kokku tooteid {{ products.length }}. Kokku toodi
                    {{ showOnlyColor }} kapslisse
                    {{ allProductsEverSelected.length }} toodet.
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
                    <div
                        v-for="visitor in mappedVisitors"
                        :key="'visitor' + visitor._id"
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
