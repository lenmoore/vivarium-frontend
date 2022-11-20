<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onMounted } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();
onMounted(async () => {
    await performanceStore.getCurrentPerformanceVisitors();
    await humanityStore.fetchBaskets();
});

const visitors = computed(() => performanceStore.getVisitors);
const baskets = computed(() => humanityStore.getBaskets);

const mappedVisitors = visitors.value.map((visitor) => ({
    ...visitor,
    basket: baskets.value.find((b) => b.visitor === visitor._id),
}));
console.log(mappedVisitors);
</script>

<template>
    <div>
        <h2>Publik</h2>
        <div>publiku nimekiri vms</div>
        <div v-if="visitors && baskets && mappedVisitors">
            <div class="info-block">Visitors: {{ mappedVisitors.length }}</div>
            <div class="visitors">
                <div
                    :key="visitor._id"
                    v-for="visitor in mappedVisitors"
                    class="visitor-wrapper"
                >
                    <h6>Garderoobinumber: {{ visitor.wardrobe_number }}</h6>
                    Tooteid korvis: {{ visitor.basket.products.length }}
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
