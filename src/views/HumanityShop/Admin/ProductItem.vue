<script setup>
import { defineProps } from 'vue';

defineProps(['product']);
</script>
<template>
    <div>
        <img :src="product.imageUrl" alt="" /> {{ product.title }}
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
</style>
