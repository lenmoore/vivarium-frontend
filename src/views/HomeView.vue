<script setup>
import { useVisitorStore } from '@/store/visitor.store';
import { onMounted, reactive, ref } from 'vue';

const visitorStore = useVisitorStore();

let visitor = reactive(visitorStore.getVisitor);
const quizResults = visitor.quiz_results;
const basket = reactive(visitor).basket;
console.log('visitor', visitor);

onMounted(() => {
    console.log('kas see pole see?');
    visitorStore.fetchVisitor(visitor.visitorId);
});

function deleteAllQuizResults() {
    const updateVisitor = ref(visitor);
    updateVisitor.value.quiz_results = [];
    // updateVisitor.value.quiz_results = [];
    console.log('update visitor:', updateVisitor.value);
    const viss = visitorStore.editVisitor(updateVisitor.value);
    console.log(viss);
}
</script>

<template>
    <div>
        <h2>gardekas {{ visitor.wardrobe_number }}</h2>
        Homeview arenduse ajaks, mis kaob hiljem publiku jaoks ara, aga praegu
        saab siit vaadata, mis vark on, kuniks pole neid agregeerimislehti.
    </div>
    <div>Aktiivse faasi nimi:</div>
    <div>Aktiivse m2ngu nimi:</div>

    <div v-if="visitor && basket && quizResults">
        <h3>Kasutaja ylevaade</h3>
        <h4>Valikud</h4>
        <table style="border: 1px solid black">
            <tr style="border: 1px solid black">
                <td>fuchsia</td>
                <td>green</td>
                <td>blue</td>
                <td>orange</td>
            </tr>
            <tr>
                <td>val</td>
                <td>val</td>
                <td>val</td>
                <td>val</td>
            </tr>
        </table>
        <div>
            <button
                class="btn btn-outline-primary"
                @click="deleteAllQuizResults"
            >
                Kustuta koik results
            </button>
            <div v-for="(res, i) in quizResults" :key="'selected' + i">
                {{ res.result_text }}
            </div>
        </div>

        <h4>Humanity shopi korv</h4>
        <RouterLink :to="{ name: 'visitor.humanity-shop.basket' }"
            >mine paris korvi
        </RouterLink>
        <div>
            <div v-for="(res, i) in basket.products" :key="'product' + i">
                tooteID {{ res }}
            </div>
        </div>
    </div>
</template>

<style>
td {
    width: 4rem;
    border: 1px solid black;
}
</style>
