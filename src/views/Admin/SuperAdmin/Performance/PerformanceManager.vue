<script setup>
import { usePerformanceStore } from '../../../../store/performance.store';
import { computed, ref } from 'vue';
import BaseForm from '../../../../components/BaseForm/index.vue';
import BaseInput from '../../../../components/BaseForm/BaseInput.vue';
import moment from 'moment';
import PerformanceMenu from './Menu/PerformanceMenu.vue';
import router from '../../../../router/index';

const performanceStore = usePerformanceStore();
performanceStore.getPerformances();
performanceStore.getPhases();

const newPerformance = {
    title: '',
    location: '',
    date: Date,
};
let attrs = ref({
    showNewPerformanceForm: false,
});
const performances = computed(() => performanceStore.performances);
const phases = computed(() => performanceStore.phases);
console.log(phases);
const requestPhasesList = phases.value;
console.log(requestPhasesList);

async function onSubmit() {
    const createdPerformance = await performanceStore.addPerformance({
        title: newPerformance.title,
        location: newPerformance.location,
        date: moment(newPerformance.date).format('YYYY-MM-DD HH:mm'),
        phases: requestPhasesList,
    });

    console.log(createdPerformance);
    await router.push({
        name: 'admin.performance-manager.performance',
        params: {
            id: createdPerformance._id,
        },
    });
}
</script>

<template>
    <div class="h-100">
        <PerformanceMenu :menu-items="performances" />

        <div v-if="attrs.showNewPerformanceForm">
            <BaseForm ref="form" @submit="onSubmit">
                <BaseInput
                    id="name"
                    v-model="newPerformance.title"
                    :type="`text`"
                    label="Etenduse nimi"
                    name="performance_name"
                />
                <BaseInput
                    id="location"
                    v-model="newPerformance.location"
                    :type="`text`"
                    label="Etenduse location"
                    name="performance_location"
                />
                <BaseInput
                    id="date"
                    v-model="newPerformance.date"
                    :type="`date`"
                    label="Etenduse kuupaev"
                    name="performance_date"
                />
            </BaseForm>
        </div>
        <div v-else>
            <button
                class="btn btn-primary"
                @click="attrs.showNewPerformanceForm = true"
            >
                Lisa uus etendus
            </button>
        </div>
    </div>
</template>
