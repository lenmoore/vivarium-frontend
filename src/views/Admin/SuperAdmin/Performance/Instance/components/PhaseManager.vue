<script setup>
import { defineProps } from 'vue';
import Phase from './Phase.vue';
import { usePerformanceStore } from '../../../../../../store/performance.store';

const props = defineProps({
    phases: Array,
});

function onToggle(phase) {
    console.log(phase);

    const performanceStore = usePerformanceStore();
    performanceStore.editPhase(phase);
}
</script>

<template>
    <div>
        <div v-for="phase in props.phases" :key="phase._id">
            <Phase :phase="phase" @toggle="onToggle(phase)" />
        </div>
    </div>
</template>
