<script setup>
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
const route = useRoute();

const humanityStore = useHumanityShopStore();
humanityStore.getProducts();

const products = computed(() => humanityStore.products);
const id = route.params.id.toString();
let product = products.value.find((p) => p._id === id);
</script>

<template>
    <div>
        <h2>{{ product.title }}</h2>
        <div class="d-flex">
            <div class="product-details">
                <div>{{ product.description }}</div>
                <div>Price: {{ product.price }}</div>

                <div class="values-wrapper">
                    <div class="values">
                        <div class="value">
                            <span class="green">
                                {{
                                    Math.round(
                                        (product.humanity_values.green.average +
                                            Number.EPSILON) *
                                            100
                                    ) / 100
                                }}
                            </span>
                            {{ product.humanity_values.green.entries.length }}
                        </div>
                        <div class="value">
                            <span class="red">
                                {{
                                    Math.round(
                                        (product.humanity_values.red.average +
                                            Number.EPSILON) *
                                            100
                                    ) / 100
                                }}
                            </span>
                            {{ product.humanity_values.red.entries.length }}
                        </div>
                        <div class="value">
                            <span class="blue">
                                {{
                                    Math.round(
                                        (product.humanity_values.blue.average +
                                            Number.EPSILON) *
                                            100
                                    ) / 100
                                }} </span
                            >{{ product.humanity_values.blue.entries.length }}
                        </div>
                        <div class="value">
                            <span class="orange">
                                {{
                                    Math.round(
                                        (product.humanity_values.orange
                                            .average +
                                            Number.EPSILON) *
                                            100
                                    ) / 100
                                }}
                            </span>
                            {{ product.humanity_values.orange.entries.length }}
                        </div>
                    </div>
                </div>
            </div>
            <img :src="product.image" alt="product img" />
            <QrcodeVue :value="product._id" :size="300" level="H" />
        </div>
        <div>green - {{ product.humanity_values.green }}</div>
        <br />
        <div>red - {{ product.humanity_values.red }}</div>
        <br />
        <div>blue - {{ product.humanity_values.blue }}</div>
        <br />
        <div>orange -{{ product.humanity_values.orange }}</div>
        <br />
    </div>
</template>

<style lang="scss">
.product-details {
    margin-right: 1rem;
    border: 1px solid black;
    padding: 1rem;
    width: 60%;
}

.values-wrapper {
    margin-top: 1rem;
    .values {
        .value {
            margin: 1rem;
        }
    }
}
</style>
