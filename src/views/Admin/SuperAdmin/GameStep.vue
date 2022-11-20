<script setup>
import { defineProps, ref } from 'vue';

import { Step } from '../../../types/performances.types';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';

console.log('gamestep');
const props = defineProps({
    step: Step,
});
const step = ref(props.step);

function addNewOptionToStep() {
    if (!step.value.question_options) {
        step.value.question_options = [];
    }
    step.value.question_options.push({
        option_text: '',
        humanity_values: {
            green: 0,
            fuchsia: 0,
            blue: 0,
            orange: 0,
        },
    });
}
function deleteGameStep() {
    console.log('todo delete step');
}
</script>

<template>
    <div class="game-step">
        <div
            class="top d-flex align-items-center justify-content-between w-100"
        >
            <span> Küsimus </span>
            <button @click="deleteGameStep">Kustuta</button>
        </div>
        <div>
            <BaseInput
                id="question_text"
                label="question_text"
                name="question_text"
                type="text"
                v-model="step.question_text"
            />
        </div>
        <div>
            variandid
            <div
                :key="`option_${i}`"
                v-for="(option, i) in step.question_options"
                class="d-flex align-items-center justify-content-between"
            >
                <BaseInput
                    :id="`option_${i}`"
                    label="option_text"
                    class="w-100 mr-2"
                    :name="`option_${i}`"
                    type="text"
                    v-model="option.option_text"
                />
                <span class="values d-flex">
                    <BaseInput
                        :id="`option_green_${i}`"
                        label="option_green"
                        :name="`option_green_${i}`"
                        type="number"
                        input-class="small-number green"
                        v-model="option.humanity_values.green"
                    />
                    <BaseInput
                        :id="`option_fuchsia_${i}`"
                        label="option_fuchsia"
                        :name="`option_fuchsia_${i}`"
                        type="number"
                        input-class="small-number fuchsia"
                        v-model="option.humanity_values.fuchsia"
                    />
                    <BaseInput
                        :id="`option_orange_${i}`"
                        label="option_orange"
                        :name="`option_orange_${i}`"
                        type="number"
                        input-class="small-number orange"
                        v-model="option.humanity_values.orange"
                    />
                    <BaseInput
                        :id="`option_blue_${i}`"
                        label="option_blue"
                        :name="`option_blue_${i}`"
                        type="number"
                        input-class="small-number blue"
                        v-model="option.humanity_values.blue"
                    />
                </span>
            </div>
            <div>
                <button class="btn btn-icon" @click="addNewOptionToStep">
                    + variant
                </button>
            </div>
        </div>
        <div class="">
            <span> </span
            ><button class="btn btn-primary" @click="$emit('submit', step)">
                salvesta
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.game-step {
    border: 1px solid black;
    margin: 1rem;
    padding: 1rem;
}
</style>
