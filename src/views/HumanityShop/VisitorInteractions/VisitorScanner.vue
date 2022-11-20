<script setup>
import { QrStream } from 'vue3-qr-reader';
import { computed, onMounted, reactive, ref } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import { useVisitorStore } from '../../../store/visitor.store';

const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
const qr = reactive({
    result: 'none',
    customError: '-',
    isValid: true,
    camera: 'auto',
    foundProduct: null,
});

const humanityShopStore = useHumanityShopStore();
onMounted(() => {
    humanityShopStore.fetchProducts();
    humanityShopStore.getVisitorBasket();
});
const products = computed(() => humanityShopStore.getProducts);
console.log(visitor.basket.products.length);

async function onDecode(content) {
    console.log('dude hello?');
    console.log(content);
    qr.result = content;
    turnCameraOff();

    // pretend it's taking really long
    // await timeout(1000);

    qr.foundProduct = products.value.find(
        (product) => product.title === content
    );

    let alreadyInBasket = visitor.basket.products.some(
        (prod) => prod === qr.foundProduct._id
    );
    console.log(alreadyInBasket);
    console.log(visitor.basket.products);
    if (alreadyInBasket) {
        console.log('dude');
        qr.isValid = false;
    }
    console.log(qr.foundProduct);
    // this.isValid = content.startsWith('http'); // todo - check if exists in products
    console.log(qr.isValid);
    // some more delay, so users have time to read the message
    // await timeout(2000);
    // turnCameraOn();
}

async function addProductToBasket() {
    console.log('gonna try and add this to the basket', qr.foundProduct);
    let basket = reactive(visitor).basket;

    basket.products.push(qr.foundProduct._id);
    await humanityShopStore.updateBasket(basket);
    qr.foundProduct = null;

    // turnCameraOn();
}

function onInit() {
    qr.foundProduct = null;
    resetValidationState();
}

function resetValidationState() {
    qr.isValid = true;
}

function turnCameraOn() {
    qr.camera = 'auto';
}

function turnCameraOff() {
    qr.camera = 'off';
}

function timeout(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
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
                            class="product-image"
                            :src="qr.foundProduct.image"
                            alt=""
                        />

                        <div v-if="qr.isValid" class="btns">
                            <button class="btn" @click="onInit">Cancel</button>
                            <button
                                class="btn btn-primary"
                                @click="addProductToBasket"
                            >
                                Add to basket
                            </button>
                        </div>
                        <div v-else>
                            This product is already in your basket.
                            <button class="btn btn-primary" @click="onInit">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </QrStream>
        </div>
    </div>
</template>

<style lang="scss">
.validation-success {
    height: 100%;
    width: 100%;
    .product-add {
        background-color: darkseagreen;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        .product-title {
            margin-top: 3rem;
            margin-bottom: -2rem;
            font-size: 1.2rem;
        }
        .product-image {
            height: 200px;
            width: 200px;
        }
        .btns {
            .btn {
                margin-top: 0.5rem;
            }
        }
    }
}
</style>
