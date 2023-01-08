<script setup>
import { computed, defineProps, onBeforeMount, ref } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const props = defineProps(['coolAlgorithmedVisitors', 'color']);
let countedProducts = [];
const humanityStore = useHumanityShopStore();
let products = [];

onBeforeMount(() => {
    products = computed(() => humanityStore.getProducts);
    getColorProducts();
});

function coloredVisitors(color) {
    switch (color) {
        case 'turq':
            return Array.from(props.coolAlgorithmedVisitors.turq);
        case 'fuchsia':
            return Array.from(props.coolAlgorithmedVisitors.fuchsia);
        case 'silver':
            return Array.from(props.coolAlgorithmedVisitors.silver);
        case 'lime':
            return Array.from(props.coolAlgorithmedVisitors.lime);
        default:
            return [
                ...Array.from(props.coolAlgorithmedVisitors.turq),
                ...Array.from(props.coolAlgorithmedVisitors.fuchsia),
                ...Array.from(props.coolAlgorithmedVisitors.lime),
                ...Array.from(props.coolAlgorithmedVisitors.silver),
            ];
    }
}

async function getColorProducts() {
    let allProductsEverSelected = ref([]);
    coloredVisitors(props.color).forEach((visitor) => {
        visitor.basket?.products?.forEach((p) => {
            console.log(visitor.wardrobe_number);
            allProductsEverSelected.value.push({
                product: p,
                visitor: visitor.wardrobe_number,
            });
        });
    });

    products.value.forEach((product) => {
        let foundProducts = allProductsEverSelected.value.filter(
            (p) => p.product?._id === product?._id
        );
        let count = foundProducts.length;
        let visitorsWhoHaveThisProduct = foundProducts.map((v) => v.visitor);
        if (!countedProducts?.find((cP) => cP?._id === product?._id)) {
            countedProducts?.push({
                ...product,
                count: count,
                visitors: visitorsWhoHaveThisProduct,
            });
        }
    });

    countedProducts = countedProducts?.sort((a, b) => b.count - a.count);
    instance?.proxy?.$forceUpdate();
}
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
