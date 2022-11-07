<script setup>
import { defineProps } from 'vue';
import { Phase } from '../../../../types/performances.types';

const props = defineProps({
    phase: Phase,
});
</script>

<template>
    <div class="phase">
        <h5>Phase {{ props.phase.name }}</h5>
        <button @click="$emit('toggle')">
            {{ props.phase.active ? 'stop' : 'start' }}
        </button>
    </div>
</template>

<style lang="scss">
.phase {
    border: 1px solid black;
    margin: 0.5rem;
    padding: 0.5rem;
    display: flex;
}
</style>
