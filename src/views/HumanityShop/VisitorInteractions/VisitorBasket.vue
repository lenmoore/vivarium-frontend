<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { ref, onBeforeMount, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

const visitorStore = useVisitorStore();
const humanityStore = useHumanityShopStore();

let showWantToRemoveModal = ref(false);
let removeItemId = ref('');

onBeforeMount(async () => {
    await humanityStore.getVisitorBasket();
    await humanityStore.fetchProducts();
});
let visitor = ref(visitorStore.getVisitor);
let productsInBasket = ref(visitor?.value?.basket?.products);
console.log(productsInBasket);
let basket = visitor.value.basket;

async function removeProduct(item) {
    console.log(item);
    showWantToRemoveModal.value = false;
    console.log(basket.products);
    let newBasketProducts = basket.products.filter(
        (product) => product._id !== item._id
    );

    console.log('newBasketProducts', newBasketProducts);
    await humanityStore.updateBasket({
        ...basket,
        products: newBasketProducts,
    });
    productsInBasket = newBasketProducts;
    removeItemId = '';
    location.replace('/visitor/humanity-shop/scan');
}
</script>
<template>
    <div class="h-100 d-flex flex-column justify-content-between">
        <div
            class="h-100 d-flex flex-column justify-content-between basket-list"
        >
            Korvis hetkel {{ productsInBasket.length }} toodet.
            <div class="basket-items-wrapper">
                <div
                    v-for="(item, i) in productsInBasket"
                    :key="item._id + i"
                    class="hover basket-item"
                >
                    <div class="d-flex align-items-center">
                        <img :src="item.image" alt="" height="90" />
                        <span
                            v-if="
                                !(
                                    showWantToRemoveModal &&
                                    removeItemId === item._id
                                ) || !showWantToRemoveModal
                            "
                            class="m-2"
                        >
                            {{ item.title }}
                        </span>
                    </div>

                    <div
                        v-if="
                            showWantToRemoveModal && removeItemId === item._id
                        "
                        class="d-flex justify-content-end"
                    >
                        Kindel, et eemaldad toote?
                        <button
                            class="btn btn-outline-primary m-1 font-size-xs"
                            @click="
                                showWantToRemoveModal = false;
                                removeItemId = '';
                            "
                        >
                            Ei
                        </button>
                        <button
                            class="btn btn-primary m-1 font-size-xs"
                            @click="removeProduct(item)"
                        >
                            Eemalda toode
                        </button>
                    </div>
                    <div v-else>
                        <button
                            class="btn d-flex align-items-baseline"
                            @click="
                                showWantToRemoveModal = true;
                                removeItemId = item._id;
                            "
                        >
                            <span>eemalda</span>
                            <span class="font-size-xl"> &#9746; </span>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="basket && basket.confirmed">
                Su korv on juba kinnitatud.
                <RouterLink :to="{ name: 'home' }">Vaata</RouterLink>
            </div>
        </div>
        <div class="bottom-fixed">
            <div
                v-if="basket.products.length === 0"
                class="align-items-center justify-content-center d-flex w-100"
            >
                Su korvis pole veel tooteid.
            </div>
            <div
                v-if="basket.products.length === 9"
                class="text-bg-success p-2"
            >
                Korvi mahub 9 toodet. Kui tahad veel midagi lisada, pead
                millestki loobuma.
            </div>
            <div
                v-else
                class="align-items-center justify-content-center d-flex w-100"
            >
                <a class="btn btn-primary" href="/visitor/humanity-shop/scan">
                    Vajuta, et tootekood skaneerida
                </a>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.basket-items-wrapper {
    width: 100%;

    .basket-item {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid orange;
    }
}

.basket-list {
    height: 95vh;
    overflow: scroll;
}

.bottom-fixed {
    bottom: 0;
    z-index: 2;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
