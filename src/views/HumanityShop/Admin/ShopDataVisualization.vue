<template>
    <div>
        <h1>data vis</h1>
        hello:
        <div>
            {{ data }}
        </div>
    </div>
</template>

<script setup>
import { useDataVisStore } from '../../../store/humanity-shop/data-vis-store';
import { computed } from 'vue';

const { getQuestionnaireResultsFromCSV } = useDataVisStore();

const data = computed(() => {
    return getQuestionnaireResultsFromCSV();
});
</script>
