<script setup>
import { defineProps } from 'vue';
const props = defineProps(['to', 'label']);
</script>

<template>
    <RouterLink :to="props.to"
        ><i class="fa-solid fa-arrow-right"></i>{{ props.label }}</RouterLink
    >
</template>
