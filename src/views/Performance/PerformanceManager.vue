<script setup>
import { usePerformanceStore } from '../../store/performance.store';
import { computed } from 'vue';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import moment from 'moment';
import PerformanceMenu from './Menu/PerformanceMenu.vue';

const performanceStore = usePerformanceStore();
performanceStore.getPerformances();
performanceStore.getPhases();

const newPerformance = {
    title: '',
    location: '',
    date: Date,
};
const performances = computed(() => performanceStore.performances);
const phases = computed(() => performanceStore.phases);
console.log(phases);
const requestPhasesList = phases.value;
console.log(requestPhasesList);

async function onSubmit() {
    return await performanceStore.addPerformance({
        title: newPerformance.title,
        location: newPerformance.location,
        date: moment(newPerformance.date).format('YYYY-MM-DD HH:mm'),
        phases: requestPhasesList,
    });
}
</script>

<template>
    <div class="h-100">
        <PerformanceMenu :menu-items="performances" />

        <div>
            <BaseForm @submit="onSubmit">
                <BaseInput
                    id="name"
                    label="Etenduse nimi"
                    name="performance_name"
                    :type="`text`"
                    v-model="newPerformance.title"
                />
                <BaseInput
                    id="location"
                    label="Etenduse location"
                    name="performance_location"
                    :type="`text`"
                    v-model="newPerformance.location"
                />
                <BaseInput
                    id="date"
                    label="Etenduse kuupaev"
                    name="performance_date"
                    :type="`date`"
                    v-model="newPerformance.date"
                />
            </BaseForm>
        </div>
    </div>
</template>
