<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';

import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let countedProducts = computed(() => performanceStore.sortedProducts);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color);

onBeforeMount(async () => {
    console.log(router.currentRoute);
    console.log('does it even..mount,', showOnlyColorRoute);
    await performanceStore.getActorCapsuleProducts(showOnlyColorRoute.value);
    countedProducts = computed(() => performanceStore.sortedProducts);
    console.log(countedProducts);
});

setInterval(async function () {
    await performanceStore.getActorCapsuleProducts(showOnlyColorRoute.value);
    countedProducts = computed(() => performanceStore.sortedProducts);
    instance?.proxy?.$forceUpdate();
}, 120000);
</script>
<template>
    <div v-for="product in countedProducts" :key="product._id">
        <div v-if="product.count > 0" class="d-flex m-1 p-1 align-items-center">
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
</template>
