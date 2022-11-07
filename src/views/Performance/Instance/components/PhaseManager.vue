<script setup>
import { defineProps } from 'vue';
import Phase from './Phase.vue';
import { usePerformanceStore } from '../../../../store/performance.store';

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
        <div :key="phase._id" v-for="phase in props.phases">
            <Phase @toggle="onToggle(phase)" :phase="phase" />
        </div>
    </div>
</template>
