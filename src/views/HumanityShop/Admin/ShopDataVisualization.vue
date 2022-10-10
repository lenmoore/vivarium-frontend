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

const { getQuestionnaireResultsFromCSV } = useDataVisStore();

const data = await getQuestionnaireResultsFromCSV();
</script>
