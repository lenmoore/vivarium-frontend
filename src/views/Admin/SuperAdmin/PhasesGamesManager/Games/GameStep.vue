<script setup>
import { defineProps, ref } from 'vue';

import BaseInput from '../../../../../components/BaseForm/BaseInput.vue';
import { Step } from '../../../../../types/performances.types';

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
                v-model="step.question_text"
                label="question_text"
                name="question_text"
                type="text"
            />
        </div>
        <div>
            variandid
            <div
                v-for="(option, i) in step.question_options"
                :key="`option_${i}`"
                class="d-flex align-items-center justify-content-between"
            >
                <BaseInput
                    :id="`option_${i}`"
                    v-model="option.option_text"
                    :name="`option_${i}`"
                    class="w-100 mr-2"
                    label="option_text"
                    type="text"
                />
                <span class="values d-flex w-25 justify-content-between">
                    <BaseInput
                        :id="`option_green_${i}`"
                        v-model="option.humanity_values.green"
                        :name="`option_green_${i}`"
                        input-class="small-number green"
                        label="laim"
                        type="number"
                    />
                    <BaseInput
                        :id="`option_blue_${i}`"
                        v-model="option.humanity_values.blue"
                        :name="`option_blue_${i}`"
                        input-class="small-number blue"
                        label="silver"
                        type="number"
                    />
                    <BaseInput
                        :id="`option_fuchsia_${i}`"
                        v-model="option.humanity_values.fuchsia"
                        :name="`option_fuchsia_${i}`"
                        input-class="small-number fuchsia"
                        label="fchs"
                        type="number"
                    />
                    <BaseInput
                        :id="`option_orange_${i}`"
                        v-model="option.humanity_values.orange"
                        :name="`option_orange_${i}`"
                        input-class="small-number orange"
                        label="blue"
                        type="number"
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
            <span> </span>
            <button class="btn btn-primary" @click="$emit('submit', step)">
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
