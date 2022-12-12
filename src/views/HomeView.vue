<script setup>
import { useVisitorStore } from '@/store/visitor.store';
import { onMounted, reactive, ref } from 'vue';
import { useHumanityShopStore } from '@/store/humanity-shop/humanity-shop.store';

const visitorStore = useVisitorStore();

const humanityStore = useHumanityShopStore();
onMounted(async () => {
    await visitorStore.fetchVisitor(localStorage.getItem('visitorId'));
    await humanityStore.getVisitorBasket();
});
let visitor = ref(visitorStore.getVisitor);

const quizResults = reactive(visitor.value.quiz_results);
const basket = reactive(visitor.value.basket);

function deleteAllQuizResults() {
    const updateVisitor = ref(visitor);
    updateVisitor.value.quiz_results = [];
    console.log('update visitor:', updateVisitor.value);
    const viss = visitorStore.editVisitor(updateVisitor.value);
    console.log(viss);
}

function getHumanityResults() {
    let productsAndQuizAnswers = [];
    let humanity_values = { green: 0, red: 0, blue: 0, orange: 0 };
    basket.products.forEach((product) => {
        productsAndQuizAnswers.push(product);
        humanity_values.green += product?.humanity_values?.green?.average;
        humanity_values.red += product?.humanity_values?.red
            ? product?.humanity_values?.red?.average
            : product?.humanity_values?.fuchsia?.average;
        humanity_values.blue += product?.humanity_values?.blue?.average;
        humanity_values.orange += product?.humanity_values?.orange?.average;
    });
    quizResults.forEach((product) => {
        productsAndQuizAnswers.push(product);
        humanity_values.green +=
            parseInt(product.result_humanity_values['green']) || 0;
        humanity_values.red +=
            parseInt(
                product.result_humanity_values['red'] ||
                    product.result_humanity_values['fuchsia']
            ) || 0;
        humanity_values.blue +=
            parseInt(product.result_humanity_values['blue']) || 0;
        humanity_values.orange +=
            parseInt(product.result_humanity_values['orange']) || 0;
    });
    console.log(productsAndQuizAnswers);
    return humanity_values;
}

let humanityResults = {};
if (visitor && basket && quizResults) {
    humanityResults = ref(getHumanityResults());
}
</script>

<template>
    <div class="container">
        <div v-if="visitor && basket && quizResults" class="border">
            {{ humanityResults }}
        </div>
        <div v-if="visitor">
            <h2>ID {{ visitor.wardrobe_number }} Character sheet</h2>
        </div>

        <div v-else>Siin pole sulle praegu midagi. Logi parem sisse.</div>

        <div v-if="visitor">
            <div v-if="basket">
                <h4>Votad kapslisse kaasa</h4>

                <div class="d-flex flex-wrap">
                    <div
                        v-for="(res, i) in basket.products"
                        :key="'product' + i"
                        class="d-flex flex-column align-items-center border m-1"
                    >
                        <img :src="res.image" alt="" height="100" />
                        <small>{{ res.title }}</small>
                    </div>
                </div>
            </div>

            <div v-if="quizResults.length">
                <h4>Valikud</h4>

                <div
                    v-for="(res, i) in quizResults"
                    :key="'selected' + i"
                    class="border"
                >
                    {{ res.result_text }}
                    <small style="font-size: 10px">{{
                        res.result_humanity_values
                    }}</small>
                </div>
            </div>
            <button
                class="btn btn-outline-primary mt-4"
                @click="deleteAllQuizResults"
            >
                Kustuta koik quizide vastused (ARA VAJUTA)
            </button>
        </div>
    </div>
</template>

<style>
td {
    width: 4rem;
    border: 1px solid black;
}
</style>
