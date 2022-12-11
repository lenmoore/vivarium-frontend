<script setup>
import { defineProps } from 'vue';
import { Phase } from '../../../../../../types/performances.types';

const props = defineProps({
    phase: Phase,
});
</script>

<template>
    <div
        :class="{
            active: props.phase.active,
        }"
        class="phase"
    >
        <h5>Phase {{ props.phase.name }}</h5>
        <button
            :class="{
                'btn-primary active': props.phase.active,
                'btn-outline-primary': !props.phase.active,
            }"
            class="btn"
            @click="$emit('toggle')"
        >
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
    align-items: center;
    justify-content: space-between;
}

.active {
    background-color: #42b983;
}
</style>
