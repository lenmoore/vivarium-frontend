<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { ref, onMounted, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
const humanityStore = useHumanityShopStore();

onMounted(() => {
    humanityStore.getVisitorBasket();
    humanityStore.fetchProducts();
});

const basket = reactive(visitor).basket;
const products = ref(humanityStore.getProducts);
let productsInBasket = products.value.filter((p) =>
    basket.products.includes(p._id)
);
</script>
<template>
    <div>
        visitor basket
        <div>visitorId: {{ visitor.visitorId }}</div>
        {{ basket }} <br /><br />
        <div class="basket-items-wrapper">
            <div
                :key="item.id"
                class="hover basket-item"
                v-for="item in productsInBasket"
            >
                {{ item.title }}

                <div>
                    <button class="btn">X</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.basket-items-wrapper {
    width: 100%;
    border: 1px solid black;
    .basket-item {
        border: 1px solid red;

        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
        }
    }
}
</style>
