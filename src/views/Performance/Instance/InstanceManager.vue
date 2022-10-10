<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
const route = useRoute();
const id = route.params.id.toString();

const performanceStore = usePerformanceStore();
performanceStore.getPerformances();

const performances = computed(() => performanceStore.performances);
const performance = performances.value.find((p) => p._id === id);
</script>

<template>
    <div>
        <h1>instance manager</h1>
        <div v-if="performance">
            {{ performance.title }} {{ performance.date }}
        </div>
    </div>
</template>
