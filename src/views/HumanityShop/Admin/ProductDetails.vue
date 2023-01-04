<script setup>
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';

const route = useRoute();
import ProductBar from './ProductBar.vue';
import router from '../../../router/index';

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
        avg: product.humanity_values.fuchsia?.average,
        sum: product.humanity_values.fuchsia?.entries?.reduce((a, b) => a + b),
        counts: {
            1: product.humanity_values.fuchsia?.entries?.filter((v) => v === 1)
                .length,
            2: product.humanity_values.fuchsia?.entries?.filter((v) => v === 2)
                .length,
            3: product.humanity_values.fuchsia?.entries?.filter((v) => v === 3)
                .length,
            4: product.humanity_values.fuchsia?.entries?.filter((v) => v === 4)
                .length,
            5: product.humanity_values.fuchsia?.entries?.filter((v) => v === 5)
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

async function openEdit() {
    await router.push({
        name: 'superadmin.games.humanity-shop.edit',
        params: product,
    });
}

async function back() {
    await router.push({
        name: 'superadmin.games.humanity-shop',
    });
    location.reload();
}
</script>

<template>
    <div>
        <button class="btn btn-outline-primary" @click="back">tooted</button>
        <div class="d-flex">
            <!--            <button class="btn" @click="openEdit">edit</button>-->
            <div class="product-details d-flex w-100">
                <QrcodeVue :size="300" :value="product._id" level="H" />
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
