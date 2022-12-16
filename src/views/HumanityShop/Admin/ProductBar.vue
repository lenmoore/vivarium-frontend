<script setup>
import { onBeforeMount, reactive } from 'vue';
import { Chart } from 'chart.js/auto';

import { defineProps } from 'vue';

const props = defineProps(['data']);

const data = reactive(props.data);
console.log('18->', data.green);
onBeforeMount(() => {
    const ctx = document.getElementById('general-chart');

    // todo make chart for distribution of grades for each color + display sum of all responses
    new Chart(ctx, {
        type: 'bar',
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
            },
            responsive: true,
        },
        data: {
            labels: [
                'lime (' + data.green?.sum + ' pts)',
                'blue (' + data.blue?.sum + ' pts)',
                'silver (' + data.silver?.sum + ' pts)',
                'fuchsia (' + data.fuchsia?.sum + ' pts)',
            ],
            datasets: [
                {
                    label: 'averages',
                    data: [
                        data.green?.avg,
                        data.blue?.avg,
                        data.silver?.avg,
                        data.fuchsia?.avg,
                    ],
                    backgroundColor: [
                        'rgb(151,255,99, 0.6)',
                        'rgb(75, 192, 192, 0.6)',
                        'rgb(162,160,155, 0.6)',
                        'rgb(244,86,255, 0.6)',
                    ],
                    borderColor: [
                        'rgb(151,255,99)',
                        'rgb(75, 192, 192)',
                        'rgb(162,160,155)',
                        'rgb(244,86,255)',
                    ],
                    borderWidth: 1,
                    maxBarThickness: 20,
                },
            ],
        },
    });
});
</script>

<template>
    <div class="chart-wrapper">
        Keskmine:
        <canvas id="general-chart"></canvas>
    </div>
</template>

<style lang="scss">
.chart-wrapper {
    background-color: white;
    //height: 400px;
    width: 400px;
    padding: 2rem;
    margin-top: 2rem;
}
</style>
