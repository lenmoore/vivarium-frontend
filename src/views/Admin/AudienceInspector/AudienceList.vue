<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onMounted, ref, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();
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

const visitors = reactive(performanceStore.visitors);
const baskets = computed(() => humanityStore.getBaskets);
const products = computed(() => humanityStore.getProducts);
let viewOptions = ref({
    showSummaryList: true,
    showProductsSummary: false,
    showQuizSummary: false,
});

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

const mappedVisitors = visitors.map((visitor) => ({
    ...visitor,
    basket: baskets.value.find((b) => b._id === visitor.basket._id),
}));
const allProductsEverSelected = [];
mappedVisitors.forEach((visitor) =>
    visitor.basket.products.forEach((prod) =>
        allProductsEverSelected.push(prod)
    )
);
let countedProducts = reactive([]);
products.value.forEach((product) => {
    let count = allProductsEverSelected.filter(
        (p) => p._id === product._id
    ).length;
    if (!countedProducts.find((cP) => cP._id === product._id)) {
        countedProducts.push({ ...product, count: count });
    }
});
let sortedCountedProducts = countedProducts.sort((a, b) => a.count < b.count);

console.log(mappedVisitors);
</script>

<template>
    <div>
        <div v-if="visitors && baskets && mappedVisitors">
            <div class="info-block">
                Saalis inimesi: {{ mappedVisitors.length }}
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

            <div v-if="viewOptions.showSummaryList" class="visitors">
                <div
                    v-for="visitor in mappedVisitors"
                    :key="visitor._id"
                    class="visitor-wrapper"
                >
                    <h6>Garderoobinumber: {{ visitor.wardrobe_number }}</h6>
                    Tooteid korvis: {{ visitor.basket.products.length }}
                </div>
            </div>

            <div v-else-if="viewOptions.showProductsSummary">
                Kokku {{ allProductsEverSelected.length }} toodet
                <div
                    v-for="product in sortedCountedProducts"
                    :key="product._id"
                >
                    {{ product.title }}
                    <img :src="product.image" alt="" height="100" />
                    {{ product.count }}
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
    </div>
</template>

<style lang="scss">
.visitor-wrapper {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    background-color: #e5e5e5;
}
</style>
