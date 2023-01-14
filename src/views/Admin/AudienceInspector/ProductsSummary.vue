<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';

import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let countedProducts = computed(() => performanceStore.sortedProducts);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color);
let amountOfProductsInCapsule = ref(0);
let isLoading = ref(false);
onBeforeMount(async () => {
    isLoading.value = true;
    console.log(router.currentRoute);
    console.log('does it even..mount,', showOnlyColorRoute);
    await performanceStore.getActorCapsuleProducts(showOnlyColorRoute.value);
    countedProducts = computed(() => performanceStore.sortedProducts);
    amountOfProductsInCapsule.value = countedProducts.value
        .map((p) => p.count)
        .reduce((a, b) => a + b);
    console.log(countedProducts);
    isLoading.value = false;
});

setInterval(async function () {
    await performanceStore.getActorCapsuleProducts(showOnlyColorRoute.value);
    countedProducts = computed(() => performanceStore.sortedProducts);
    instance?.proxy?.$forceUpdate();
}, 120000);
</script>
<template>
    <div v-if="isLoading" class="d-flex justify-content-center">
        <img alt="loader" src="/public/Spinner-1s-200px.gif" />
    </div>
    <div v-else>
        {{ amountOfProductsInCapsule }}
        <div v-for="product in countedProducts" :key="product._id">
            <div
                v-if="product.count > 0"
                class="d-flex m-1 p-1 align-items-center"
            >
                <img :src="product.image" alt="" height="100" />
                <div>
                    <h4 class="m-1 p-1">
                        {{ product.count }} x
                        {{ product.title }}
                    </h4>
                    <div class="m-1">
                        kaasas:&nbsp;&nbsp;<span
                            v-for="visitor in product.visitors"
                            :key="visitor + product.title"
                        >
                            {{ visitor }}, &nbsp;
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
