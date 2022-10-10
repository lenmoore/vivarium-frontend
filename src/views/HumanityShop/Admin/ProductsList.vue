<script setup>
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { computed } from 'vue';
import ProductItem from './ProductItem.vue';
const humanityStore = useHumanityShopStore();

humanityStore.getProducts();
let products = computed(() => humanityStore.products);

function sortProducts(color) {
    return products.value.sort(
        (a, b) =>
            a.humanity_values[color].average - b.humanity_values[color].average
    );
}

function sortByRed() {
    products = sortProducts('red');
}
</script>
<template>
    <div class="products-list-wrapper">
        <button @on-click="sortByRed">red</button>
        <!--        <button @on-click="sortByBlue">blue</button>-->
        <ProductItem :key="p._id" v-for="p in products" :product="p" />
    </div>
</template>

<style lang="scss">
.products-list-wrapper {
    margin-left: 10rem;
}
</style>
