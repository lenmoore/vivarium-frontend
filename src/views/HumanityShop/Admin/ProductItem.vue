<script setup>
import router from '../../../router';
import { defineProps } from 'vue';
defineProps(['product']);
</script>
<template>
    <RouterLink
        :to="{
            name: 'admin.humanity-shop.products.details',
            params: {
                id: product._id,
            },
        }"
        class="product-wrapper"
    >
        <div>
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
    </RouterLink>
</template>

<style lang="scss">
@import 'src/assets/common';
.values {
    width: 250px;
    display: flex;
    justify-content: space-between;
    span {
        color: white;
        width: 40px !important;
        text-decoration: none;
    }
    .red {
        color: $fuchsia;
    }
    .green {
        color: $neon-green;
    }
    .blue {
        color: $silver;
    }
    .orange {
        color: $blue;
    }
}

.product-wrapper {
    padding: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: rgba(98, 53, 53, 0.67);
    color: white;
    text-decoration: none;
    &:hover {
        color: $orange;
    }
}
</style>
