<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { ref, onBeforeMount, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';

const visitorStore = useVisitorStore();
const humanityStore = useHumanityShopStore();

let showWantToRemoveModal = ref(false);
let removeItemId = ref('');
let showConfirmBasketConfirmation = ref(false);

onBeforeMount(async () => {
    await humanityStore.getVisitorBasket();
    await humanityStore.fetchProducts();
});
let visitor = ref(visitorStore.getVisitor);
let productsInBasket = ref(visitor.value.basket.products);
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
    await humanityStore.getVisitorBasket();
    location.reload();
}

async function confirmBasket() {
    console.log(basket);
    await humanityStore.updateBasket({
        ...basket.value,
        confirmed: true,
    });
    await router.push({ name: 'basket-done' });
    location.reload();
}
</script>
<template>
    <div class="container h-100 d-flex flex-column justify-content-between">
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
                    v-if="showWantToRemoveModal && removeItemId === item._id"
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
        <div
            v-if="basket && !basket.confirmed"
            class="d-flex flex-column w-100 align-items-center justify-content-center confirm-wrapper"
        >
            <div v-if="!showConfirmBasketConfirmation" class="m-4">
                <div>Kas oled valmis?</div>
                <div class="d-flex flex-column w-100 justify-content-center">
                    <button
                        class="w-100 btn btn-primary"
                        @click="showConfirmBasketConfirmation = true"
                    >
                        Kinnita korv
                    </button>
                </div>
            </div>
            <div
                v-else
                class="w-100 d-flex align-items-center justify-content-between flex-column"
            >
                <div
                    v-if="basket.products.length < 10"
                    class="d-flex justify-content-center align-items-center text-center"
                >
                    Kas oled kindel? Sa saaksid veel kaasa votta
                    {{ 9 - basket.products.length }} asja.
                </div>
                <div class="d-flex w-100">
                    <button
                        class="p-2 m-2 w-100 d-flex align-items-center justify-content-center btn btn-outline-primary"
                        @click="showConfirmBasketConfirmation = false"
                    >
                        Ei
                    </button>
                    <button
                        class="p-2 m-2 w-100 align-items-center justify-content-center d-flex btn btn-primary"
                        @click="confirmBasket"
                    >
                        Kinnita korv
                    </button>
                </div>
            </div>
            <small class="bg-dark text-white"
                >ps. kui tootenimed ei ilmu, tee refresh</small
            >
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

.confirm-wrapper {
    bottom: 0;
}
</style>
