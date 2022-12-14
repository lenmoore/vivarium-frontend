<script setup>
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';

const route = useRoute();
import Chart from 'chart.js/auto';
import ProductBar from './ProductBar.vue';

const humanityStore = useHumanityShopStore();
humanityStore.fetchProducts();

const products = computed(() => humanityStore.products);
const id = route.params.id.toString();
let product = products.value.find((p) => p._id === id);
console.log(product);
let entryCounts = {
    green: {
        avg: product.humanity_values.green?.average,
        sum: product.humanity_values.green?.entries.reduce((a, b) => a + b),
        counts: {
            1: product.humanity_values.green?.entries.filter((v) => v === 1)
                .length,
            2: product.humanity_values.green?.entries.filter((v) => v === 2)
                .length,
            3: product.humanity_values.green?.entries.filter((v) => v === 3)
                .length,
            4: product.humanity_values.green?.entries.filter((v) => v === 4)
                .length,
            5: product.humanity_values.green?.entries.filter((v) => v === 5)
                .length,
        },
    },
    fuchsia: {
        avg: product.humanity_values.red?.average,
        sum: product.humanity_values.red?.entries.reduce((a, b) => a + b),
        counts: {
            1: product.humanity_values.red?.entries.filter((v) => v === 1)
                .length,
            2: product.humanity_values.red?.entries.filter((v) => v === 2)
                .length,
            3: product.humanity_values.red?.entries.filter((v) => v === 3)
                .length,
            4: product.humanity_values.red?.entries.filter((v) => v === 4)
                .length,
            5: product.humanity_values.red?.entries.filter((v) => v === 5)
                .length,
        },
    },
    blue: {
        avg: product.humanity_values.orange?.average,
        sum: product.humanity_values.orange?.entries.reduce((a, b) => a + b),
        counts: {
            1: product.humanity_values.orange?.entries.filter((v) => v === 1)
                .length,
            2: product.humanity_values.orange?.entries.filter((v) => v === 2)
                .length,
            3: product.humanity_values.orange?.entries.filter((v) => v === 3)
                .length,
            4: product.humanity_values.orange?.entries.filter((v) => v === 4)
                .length,
            5: product.humanity_values.orange?.entries.filter((v) => v === 5)
                .length,
        },
    },
    silver: {
        avg: product.humanity_values.blue?.average,
        sum: product.humanity_values.blue?.entries.reduce((a, b) => a + b),
        counts: {
            1: product.humanity_values.blue?.entries.filter((v) => v === 1)
                .length,
            2: product.humanity_values.blue?.entries.filter((v) => v === 2)
                .length,
            3: product.humanity_values.blue?.entries.filter((v) => v === 3)
                .length,
            4: product.humanity_values.blue?.entries.filter((v) => v === 4)
                .length,
            5: product.humanity_values.blue?.entries.filter((v) => v === 5)
                .length,
        },
    },
};
console.log(entryCounts);
console.log(product);
</script>

<template>
    <div>
        <div class="d-flex">
            <div class="product-details d-flex w-100">
                <QrcodeVue
                    :size="300"
                    :value="product.title"
                    background="#faa17d"
                    foreground="#3e48ad"
                    level="H"
                />
                <div class="d-flex flex-column align-items-center">
                    <img
                        :src="product.image"
                        alt="product img"
                        class="product-image"
                        width="300"
                    />
                    <h2>{{ product.title }}</h2>
                </div>
            </div>
        </div>

        <div class="py-4">{{ product.description }}</div>

        <ProductBar :data="entryCounts" />
    </div>
</template>

<style lang="scss">
.product-details {
    border: 1px solid black;
}

.product-image {
    height: 75%;
}
</style>
