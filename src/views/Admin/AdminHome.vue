<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useHumanityShopStore } from '../../store/humanity-shop/humanity-shop.store';
import { usePerformanceStore } from '../../store/performance.store';
import router from '../../router/index';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();

onBeforeMount(async () => {
    await humanityStore.fetchBaskets();
    await performanceStore.getPerformances();
    const activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance?.value?._id
    );
});
let getRoute = reactive('');
watch(router.currentRoute, () => {
    getRoute = router.currentRoute.value.name;
    console.log(getRoute);
});
</script>
<template>
    <div class="admin-home">
        <!--        <div class="w-100 d-flex align-items-center justify-content-center">-->
        <!--            <RouterLink-->
        <!--                :class="-->
        <!--                    getRoute === 'admin.audience.overview'-->
        <!--                        ? 'btn-primary'-->
        <!--                        : 'btn-outline-primary'-->
        <!--                "-->
        <!--                :to="{ name: 'admin.audience.overview' }"-->
        <!--                class="btn btn-outline-primary"-->
        <!--            >-->
        <!--                Publik kapslites-->
        <!--            </RouterLink>-->
        <!--            <RouterLink-->
        <!--                :class="-->
        <!--                    getRoute === 'admin.capsule'-->
        <!--                        ? 'btn-primary'-->
        <!--                        : 'btn-outline-primary'-->
        <!--                "-->
        <!--                :to="{ name: 'admin.capsule' }"-->
        <!--                class="btn mx-4"-->
        <!--            >-->
        <!--                Kapslite info-->
        <!--            </RouterLink>-->
        <!--        </div>-->
        <RouterView :key="$route.fullPath" />
    </div>
</template>

<style lang="scss" scoped>
.router-link-active {
    background-color: coral !important;
}
</style>
