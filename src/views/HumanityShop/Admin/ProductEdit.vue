<script setup>
import BaseForm from '../../../components/BaseForm/index.vue';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';
import { computed, reactive, ref } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { useRoute } from 'vue-router';
import router from '../../../router/index';

const route = useRoute();
const humanityStore = useHumanityShopStore();
humanityStore.fetchProducts();

const products = computed(() => humanityStore.products);
const id = route.params.id.toString();
let product = products.value.find((p) => p._id === id);
console.log(product);
let fuchsiaEntries = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
};
let allEntries = [];

let newProduct = {
    ...product,
    name: product.name,
    humanity_values: {
        fuchsia: null,
    },
};

async function updateProduct() {
    let count = 0;
    for (let i = 0; i < fuchsiaEntries[1]; i++) {
        allEntries.push(1);
        count++;
    }
    for (let i = 0; i < fuchsiaEntries[2]; i++) {
        allEntries.push(2);
        count++;
    }
    for (let i = 0; i < fuchsiaEntries[3]; i++) {
        allEntries.push(3);
        count++;
    }
    for (let i = 0; i < fuchsiaEntries[4]; i++) {
        allEntries.push(4);
        count++;
    }
    for (let i = 0; i < fuchsiaEntries[5]; i++) {
        allEntries.push(5);
        count++;
    }
    console.log(allEntries);
    let avg = allEntries?.reduce((a, b) => a + b, 0) / count;
    console.log(avg);
    let fuchsia = {
        average: avg,
        entries: allEntries,
    };
    console.log(newProduct);
    await humanityStore.updateProductFuchsia(fuchsia, product);
    await router.push({ name: 'superadmin.games.humanity-shop' });
    // location.reload();
}
</script>

<template>
    <div>
        <h3>Muuda toodet {{ product.title }}</h3>

        <BaseForm @submit="updateProduct">
            <div class="d-flex w-100">
                <BaseInput v-model="fuchsiaEntries[5]" label="5" />
                <BaseInput v-model="fuchsiaEntries[4]" label="4" />
                <BaseInput v-model="fuchsiaEntries[3]" label="3" />
                <BaseInput v-model="fuchsiaEntries[2]" label="2" />
                <BaseInput v-model="fuchsiaEntries[1]" label="1" />
            </div>
        </BaseForm>
    </div>
</template>
