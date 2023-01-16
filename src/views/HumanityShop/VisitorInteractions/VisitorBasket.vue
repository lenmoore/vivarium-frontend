<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { ref, onBeforeMount, reactive, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

import { usePerformanceStore } from '../../../store/performance.store';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
const humanityStore = useHumanityShopStore();
const performanceStore = usePerformanceStore();

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

let hasSeenShopIntro = ref(localStorage.getItem('hasSeenShopIntro') === '1');
console.log(hasSeenShopIntro);
let showStore = hasSeenShopIntro;
setInterval(async function () {
    await performanceStore.getPhases();
    if (basket.products.length === 0) {
        await humanityStore.getVisitorBasket();
    }
    instance?.proxy?.$forceUpdate();
}, 120000);

function setSeenShopIntro() {
    localStorage.setItem('hasSeenShopIntro', '1');
    showStore = true;
    instance?.proxy?.$forceUpdate();
}
</script>
<template>
    <div
        v-if="showStore"
        class="h-100 d-flex flex-column justify-content-between"
    >
        <div>
            <div
                v-if="basket.products.length >= 9"
                class="text-bg-success extra-small-for-tiny-mobile p-2"
            >
                Korvi mahub 9 toodet. Kui tahad veel midagi lisada, pead
                millestki loobuma. Tee oma otsuseid hoolikalt.
            </div>
            <div
                v-else
                class="d-flex flex-column align-items-center justify-content-between p-4 w-100"
            >
                <div class="px-2">
                    Korvis hetkel {{ productsInBasket.length || 0 }} toodet.
                </div>
                <a
                    class="btn btn-primary p-4"
                    href="/visitor/humanity-shop/scan"
                >
                    Vajuta, et tootekood skaneerida
                </a>
            </div>
            <div class="basket-items-wrapper extra-small-for-tiny-mobile">
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
                        class="d-flex justify-content-end m-2 extra-small-for-tiny-mobile column-for-tiny-mobile"
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
                            class="btn d-flex flex-column"
                            @click="
                                showWantToRemoveModal = true;
                                removeItemId = item._id;
                            "
                        >
                            <span class="font-size-xl">&#9746;</span>
                            <span class="font-size-xs">eemalda</span>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="basket && basket.confirmed">
                Su korv on juba kinnitatud.
                <RouterLink :to="{ name: 'home' }">Vaata</RouterLink>
            </div>
        </div>
        <div class="bottom-fixed d-flex flex-column">
            <div
                v-if="basket.products.length === 0"
                class="align-items-center justify-content-center d-flex w-100 extra-small-for-tiny-mobile"
            >
                Su korvis pole veel tooteid.
            </div>
            <div v-else-if="basket.products.length >= 9"></div>
        </div>
    </div>
    <div v-else class="d-flex flex-column justify-content-center h-100">
        <h2>Tere tulemast poodi.</h2>
        <p>
            Oled minemas pikale reisile, kus kõik eluks vajalik on olemas. Mis
            asju võtaksid sa aga reisile kaasa selleks, et tunda end mõnusalt ja
            turvaliselt? Mis asju võtaksid sa kaasa, et peletada igavust ja
            arendada oskusi? Millised Vivaariumi poe objektid kõnetavad sind
            kõige enam?
        </p>
        <p>
            Tutvu meie poega. Kuva QR-koode ja saa ülevaade meie valikust. Käi
            näitusele ring peale ja vali välja 9 objekti.
        </p>
        <p>Sul on aega kuni kl 19.15.</p>
        <p>Ära kiirusta. Mõtle läbi.</p>

        <button class="btn btn-primary w-100" @click="setSeenShopIntro">
            Alusta
        </button>
    </div>
</template>

<style lang="scss">
.basket-items-wrapper {
    width: 100%;
    margin-top: 1rem;

    .basket-item {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid orange;
    }
}

@media screen and (max-width: 350px) {
    .basket-item {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid orange;

        img {
            width: 60px !important;
            height: 60px !important;
        }
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
