<script setup>
import { useVisitorStore } from '../../../store/visitor.store';
import { computed, onMounted, reactive } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';

const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
const humanityStore = useHumanityShopStore();

onMounted(() => {
    humanityStore.getVisitorBasket();
});

const basket = reactive(visitor).basket;
</script>
<template>
    <div>
        visitor basket
        <div>visitorId: {{ visitor.visitorId }}</div>
        {{ basket }}
    </div>
</template>
