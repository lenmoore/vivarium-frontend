<script setup>
import { defineProps } from 'vue';
import router from '../../../router';
defineProps(['product']);
</script>
<template>
    <div class="product-wrapper">
        <div>
            <RouterLink
                :to="{
                    name: 'admin.humanity-shop.products.details',
                    params: {
                        id: product._id,
                    },
                }"
                >info</RouterLink
            >
            <img :src="product.imageUrl" alt="" />
            <span class="title">
                {{ product.title }}
            </span>
        </div>
        <span class="values">
            <span class="green">{{
                Math.round(
                    (product.humanity_values.green.average + Number.EPSILON) *
                        100
                ) / 100
            }}</span>
            <span class="red">{{
                Math.round(
                    (product.humanity_values.red.average + Number.EPSILON) * 100
                ) / 100
            }}</span>
            <span class="blue">{{
                Math.round(
                    (product.humanity_values.blue.average + Number.EPSILON) *
                        100
                ) / 100
            }}</span>
            <span class="orange">{{
                Math.round(
                    (product.humanity_values.orange.average + Number.EPSILON) *
                        100
                ) / 100
            }}</span>
        </span>
    </div>
</template>

<style lang="scss">
.values {
    span {
        margin: 0.5rem;
        color: white;
        padding: 0.5rem;
    }
    .red {
        background-color: indianred;
    }
    .green {
        background-color: darkseagreen;
    }
    .blue {
        background-color: cornflowerblue;
    }
    .orange {
        background-color: darkorange;
    }
}

.product-wrapper {
    padding: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid black;
}
</style>
