<script setup>
import { useVisitorStore } from '@/store/visitor.store';
import { onMounted, reactive } from 'vue';

const visitorStore = useVisitorStore();

const visitor = reactive(visitorStore.getVisitor);
const quizResults = visitor.quiz_results;
const basket = reactive(visitor).basket;
const humanityShopResults = {
    green: 0,
};
</script>

<template>
    <div>
        <h2>gardekas {{ visitor.wardrobe_number }}</h2>
        Homeview arenduse ajaks, mis kaob hiljem publiku jaoks ara, aga praegu
        saab siit vaadata, mis vark on, kuniks pole neid agregeerimislehti.
    </div>
    <div>Aktiivse faasi nimi:</div>
    <div>Aktiivse m2ngu nimi:</div>

    <div>
        <h3>Kasutaja ylevaade</h3>
        <h4>Valikud</h4>
        <table style="border: 1px solid black">
            <tr style="border: 1px solid black">
                <td>red</td>
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
            <div :key="'selected' + i" v-for="(res, i) in quizResults">
                {{ res.selected_value }}
            </div>
        </div>

        <h4>Humanity shopi korv</h4>
        <RouterLink :to="{ name: 'visitor.humanity-shop.basket' }"
            >mine paris korvi</RouterLink
        >
        <div>
            <div :key="'product' + i" v-for="(res, i) in basket.products">
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
