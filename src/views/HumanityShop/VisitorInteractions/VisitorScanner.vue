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
    isValid: false,
    camera: 'auto',
    foundProduct: null,
});

const humanityShopStore = useHumanityShopStore();
onMounted(() => {
    humanityShopStore.fetchProducts();
    humanityShopStore.getVisitorBasket();
});
const products = computed(() => humanityShopStore.getProducts);

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
    // this.isValid = content.startsWith('http'); // todo - check if exists in products
    qr.isValid = content === 'Ruubiku kuubik';
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
}

function onInit(promise) {
    promise.catch(console.error).then(resetValidationState);
}

function resetValidationState() {
    qr.isValid = undefined;
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
        <h2>Scan a product~~~</h2>
        <div class="scanner-wrapper">
            last result: {{ qr.result }} <br />
            -- <br />
            <div>
                {{ qr.foundProduct }} <br />

                <button @click="onInit">Cancel</button>
                <button @click="addProductToBasket">Add to basket</button>
            </div>
            trynna scan {{ qr.customError }}<br />
            <QrStream @decode="onDecode" @init="onInit">
                {{ qr.isValid }}
                <div v-if="qr.isValid" class="validation-success">
                    That's a product! {{ qr.result }}. Add it?
                </div>

                <div v-if="!qr.isValid" class="validation-failure">
                    No product found.
                </div>
            </QrStream>
        </div>
    </div>
</template>
