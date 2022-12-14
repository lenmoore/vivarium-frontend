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

function sortByfuchsia() {
    products = sortProducts('fuchsia');
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
        <div class="color-buttons">
            <button class="color-btn green" @click="sortByGreen">^</button>
            <button class="color-btn fuchsia" @click="sortByfuchsia">^</button>
            <button class="color-btn blue" @click="sortByBlue">^</button>
            <button class="color-btn orange" @click="sortByOrange">^</button>
        </div>
        <!--        <button @on-click="sortByBlue">blue</button>-->
        <ProductItem v-for="p in products" :key="p._id" :product="p" />
    </div>
</template>

<style lang="scss">
@import 'src/assets/common.scss';

.color-buttons {
    width: 250px;
    display: flex;
    justify-content: flex-end;
    min-width: 100%;
}

.color-btn {
    margin-left: 1.1rem;
    color: white;
    border: 0;
    padding: 0.5rem;
    width: 40px !important;

    &.fuchsia {
        background-color: $fuchsia;
    }

    &.green {
        background-color: $neon-green;
    }

    &.blue {
        background-color: $silver;
    }

    &.orange {
        background-color: $blue;
    }
}
</style>
