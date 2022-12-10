<script setup>
import { useVisitorStore } from '../../../store/visitor.store';

const visitorStore = useVisitorStore();
const visitor = visitorStore.getVisitor;
</script>
<template>
    <h1 class="d-flex justify-content-center">
        ID {{ visitor.wardrobe_number }}
    </h1>
    <RouterView />
</template>
