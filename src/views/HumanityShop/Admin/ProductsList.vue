<script setup>
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { computed } from 'vue';
import ProductItem from './ProductItem.vue';
const humanityStore = useHumanityShopStore();

humanityStore.fetchProducts();
let products = computed(() => humanityStore.products).value;

function sortProducts(color) {
    return products.sort(
        (a, b) =>
            b.humanity_values[color].average - a.humanity_values[color].average
    );
}

function sortByRed() {
    products = sortProducts('red');
}
function sortByGreen() {
    products = sortProducts('green');
}
function sortByBlue() {
    products = sortProducts('blue');
}
function sortByOrange() {
    products = sortProducts('orange');
}
</script>
<template>
    <div class="products-list-wrapper w-100">
        <div
            class="color-buttons d-flex w-100 align-content-end justify-content-end"
        >
            <button class="color-btn green" @click="sortByGreen">green</button>
            <button class="color-btn red" @click="sortByRed">red</button>
            <button class="color-btn blue" @click="sortByBlue">blue</button>
            <button class="color-btn orange" @click="sortByOrange">
                orange
            </button>
        </div>
        <!--        <button @on-click="sortByBlue">blue</button>-->
        <ProductItem :key="p._id" v-for="p in products" :product="p" />
    </div>
</template>

<style lang="scss">
@import 'src/assets/common.scss';
.color-btn {
    margin-left: 1.1rem;
    color: white;
    border: 0;
    padding: 0.5rem;

    &.red {
        background-color: $red;
    }
    &.green {
        background-color: $green;
    }
    &.blue {
        background-color: $blue;
    }
    &.orange {
        background-color: $orange;
    }
}
</style>
