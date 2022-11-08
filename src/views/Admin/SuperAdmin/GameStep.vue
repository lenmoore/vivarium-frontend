<script setup>
import { defineProps, ref } from 'vue';

import { Step } from '../../../types/performances.types';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';

console.log('gamestep');
const props = defineProps({
    step: Step,
});
const step = ref(props.step);
const newQuestionOption = {
    option_text: '',
    humanity_values: {
        green: 0,
        red: 0,
        blue: 0,
        orange: 0,
    },
};

function addNewOptionToStep() {
    if (!step.value.question_options) {
        step.value.question_options = [];
    }
    step.value.question_options.push(newQuestionOption);
}

function updateOptionText(val) {
    console.log(val);
}
</script>

<template>
    <div class="game-step">
        <small>{{ step }}</small>
        <div>
            kysimus
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
            >
                <BaseInput
                    :id="`option_${i}`"
                    label="option_text"
                    :name="`option_${i}`"
                    type="text"
                    @input="updateOptionText"
                    v-model="option.option_text"
                />
            </div>
            <div>
                <button @click="addNewOptionToStep">+ variant</button>
            </div>
        </div>
        <button @click="$emit('submit', step)">salvesta</button>
    </div>
</template>

<style lang="scss">
.game-step {
    border: 1px solid black;
    margin: 1rem;
    padding: 1rem;
}
</style>
