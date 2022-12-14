<script setup>
import { computed, onMounted, ref } from 'vue';
import { useHumanityShopStore } from '../../store/humanity-shop/humanity-shop.store';
import { usePerformanceStore } from '../../store/performance.store';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();

let viewOptions = ref({
    showSummaryList: true,
    showProductsSummary: false,
    showQuizSummary: false,
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
</script>
<template>
    <div class="admin-home container">
        <h2>Tsau, admin.</h2>
        <div v-if="$route.name === 'admin.home'" class="d-flex flex-column">
            <RouterLink :to="{ name: 'admin.audience' }">
                Publik koik
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'blue-sky' } }"
            >
                Publik blue-sky
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'fuchsia' } }"
            >
                Publik fuchsia
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'silver' } }"
            >
                Publik silver
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'lime' } }"
            >
                Publik lime
            </RouterLink>
        </div>
        <RouterView v-else />
    </div>
</template>
