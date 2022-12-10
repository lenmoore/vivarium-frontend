<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { ref, onMounted, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';

const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
const humanityStore = useHumanityShopStore();

let showWantToRemoveModal = ref(false);
let removeItemId = ref('');
onMounted(() => {
    humanityStore.getVisitorBasket();
    humanityStore.fetchProducts();
});

let basket = reactive(visitor).basket;
const products = ref(humanityStore.getProducts);
let productsInBasket = ref(
    products.value.filter((p) => basket.products.includes(p._id))
);

async function removeProduct(item) {
    showWantToRemoveModal.value = false;
    console.log(item._id);
    console.log(productsInBasket);
    let newBasketProducts = productsInBasket.value.filter(
        (product) => product._id !== item._id
    );

    console.log('newBasketProducts', newBasketProducts);
    const data = await humanityStore.updateBasket({
        ...basket,
        products: newBasketProducts,
    });
    // productsInBasket.value = products.value.filter((p) =>
    //     data.products.includes(p._id)
    // );
    productsInBasket.value = productsInBasket.value.filter(
        (p) => p._id !== item._id
    );
    console.log(productsInBasket.value.length, productsInBasket);
    console.log(data);
    removeItemId = '';
}
</script>
<template>
    <div>
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
</style>
