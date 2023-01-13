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
    if (content.length) {
        qr.value.isValid = true;
        console.log('dude hello?');
        console.log(content);
        qr.value.result = content;
        turnCameraOff();

        // pretend it's taking really long
        // await timeout(1000);

        qr.value.foundProduct = products.value.find(
            (product) =>
                product.image.includes(content) || product._id === content
        );
        console.log(qr.value);

        let alreadyInBasket = visitor.basket?.products?.some(
            (prod) => prod._id === qr.value.foundProduct._id
        );

        console.log('brr');
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
}

async function addProductToBasket() {
    console.log('gonna try and add this to the basket', qr.value.foundProduct);
    if (qr.value.isValid) {
        let basket = reactive(visitor).basket;

        basket.products.push(qr.value.foundProduct._id);
        await humanityShopStore.updateBasket(basket);
        qr.value.foundProduct = null;
        await humanityStore.getVisitorBasket();
    }

    // await router.push({ name: 'visitor.humanity-shop.basket' });
    // location.reload();
}

let loading = ref(false);

async function onInit(promise) {
    this.loading = true;

    try {
        await promise;
        qr.value.foundProduct = null;
        resetValidationState();
    } catch (error) {
        console.error(error);
    } finally {
        this.loading = false;
    }
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
        <div
            class="d-flex justify-content-center mb-4 extra-small-for-tiny-mobile column-for-tiny-mobile"
        >
            <h2>Skänni midagi!</h2>
            <a
                class="btn btn-primary small-for-tiny-mobile"
                href="/visitor/humanity-shop/basket"
                >> Korvi</a
            >
        </div>
        <div class="scanner-wrapper">
            <QrStream @decode="onDecode" @init="onInit">
                <div v-if="loading" class="loading-indicator">
                    Laen...
                    <img alt="loader" src="/public/Spinner-1s-200px.gif" />
                </div>
                <div v-if="qr.foundProduct" class="validation-success">
                    <div class="product-add">
                        <div class="product-title">
                            {{ qr.foundProduct.title }}
                        </div>
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
                        <div v-else-if="!qr.isValid" class="bg-white">
                            See toode on juba sinu korvis.
                            <button class="btn btn-primary" @click="onInit">
                                Olgu
                            </button>
                        </div>

                        <img
                            :src="qr.foundProduct.image"
                            alt=""
                            class="product-image"
                        />
                    </div>
                </div>
            </QrStream>
        </div>
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

        @media screen and (max-width: 350px) {
            .product-title {
                margin-top: 1.5rem;
                font-size: 1rem;
            }

            .product-image {
                height: 150px;
                width: 150px;
            }
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
