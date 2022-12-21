<script setup>
import { QrStream } from 'vue3-qr-reader';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { useVisitorStore } from '../../../store/visitor.store';
import router from '../../../router/index';

const humanityStore = useHumanityShopStore();
const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
const qr = ref({
    result: 'none',
    customError: '-',
    isValid: true,
    basketFull: false,
    camera: 'auto',
    foundProduct: null,
});

const humanityShopStore = useHumanityShopStore();
onBeforeMount(async () => {
    await humanityShopStore.fetchProducts();
    await humanityShopStore.getVisitorBasket();
});
const products = computed(() => humanityShopStore.getProducts);

async function onDecode(content) {
    console.log('dude hello?');
    console.log(content);
    qr.value.result = content;
    turnCameraOff();

    // pretend it's taking really long
    // await timeout(1000);

    qr.value.foundProduct = products.value.find(
        (product) => product._id === content
    );
    console.log(qr.value.foundProduct);

    let alreadyInBasket = visitor.basket?.products?.some(
        (prod) => prod === qr.value.foundProduct._id
    );
    console.log(alreadyInBasket);
    console.log(visitor.basket?.confirmed);
    if (alreadyInBasket) {
        console.log('dude');
        qr.value.isValid = false;
    }

    if (visitor.basket?.products.length === 9) {
        qr.value.basketFull = true;
        qr.value.isValid = false;
    }
    console.log(qr.value.foundProduct);
    console.log(qr.value.isValid);
    // await timeout(2000);
    // turnCameraOn();
}

async function addProductToBasket() {
    console.log('gonna try and add this to the basket', qr.value.foundProduct);
    let basket = reactive(visitor).basket;

    basket.products.push(qr.value.foundProduct._id);
    await humanityShopStore.updateBasket(basket);
    qr.value.foundProduct = null;
    await humanityStore.getVisitorBasket();

    // await router.push({ name: 'visitor.humanity-shop.basket' });
    location.reload();
}

function onInit() {
    qr.value.foundProduct = null;
    resetValidationState();
}

function resetValidationState() {
    qr.value.isValid = true;
}

function turnCameraOff() {
    qr.value.camera = 'off';
}
</script>
<template>
    <div>
        <h2>Skänni midagi!</h2>
        <div class="scanner-wrapper">
            <QrStream @decode="onDecode" @init="onInit">
                <div v-if="qr.foundProduct" class="validation-success">
                    <div class="product-add">
                        <div class="product-title">
                            {{ qr.foundProduct.title }}
                        </div>
                        <img
                            :src="qr.foundProduct.image"
                            alt=""
                            class="product-image"
                        />

                        <div v-if="qr.isValid" class="btns">
                            <button
                                class="btn btn-outline-primary"
                                @click="onInit"
                            >
                                Tühista
                            </button>
                            <button
                                class="btn btn-primary"
                                @click="addProductToBasket"
                            >
                                Lisa korvi
                            </button>
                        </div>
                        <div v-else-if="qr.basketFull">
                            Su korv on tais. Mine korvi lehele ning saad korvist
                            tooteid eemaldada, kui soovid.
                            <a href="/visitor/humanity-shop/basket">Korvi</a>
                        </div>
                        <div v-else-if="basket.confirmed">
                            Su korv on juba kinnitatud ja enam tooteid lisada ei
                            saa.
                        </div>
                        <div v-else-if="!qr.isValid" class="bg-white">
                            See toode on juba sinu korvis.
                            <button class="btn btn-primary" @click="onInit">
                                Olgu
                            </button>
                        </div>
                    </div>
                </div>
            </QrStream>
        </div>

        <a href="/visitor/humanity-shop/basket">Tagasi korvi</a>
    </div>
</template>

<style lang="scss">
.scanner-wrapper {
    height: 50vh;
}

.validation-success {
    height: 100vh;
    width: 100%;
    z-index: 100;

    .product-add {
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 60%;

        .product-title {
            margin-top: 3rem;
            font-size: 1.2rem;
        }

        .product-image {
            height: 250px;
            width: 250px;
        }

        .btns {
            .btn {
                margin: 0.5rem;
            }
        }
    }
}

.bg-white {
    background-color: white;
}
</style>
