<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
import PhaseManager from './components/PhaseManager.vue';
import { usePerformanceStore } from '../../../../../store/performance.store';

const route = useRoute();
const id = route.params.id;

const performanceStore = usePerformanceStore();
onMounted(async () => {
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
});

const performances = computed(() => performanceStore.performances);
const phases = computed(() => performanceStore.phases);

const performance = performances.value.find((p) => p._id === id);

performanceStore.getPerformanceById(id);
</script>

<template>
    <div>
        <div v-if="performance">
            {{ performance.title }} <br />
            kuupaev: {{ performance.date }}

            <h2>Phases</h2>
            <PhaseManager :phases="phases" />

            <div class="performance-settings">
                <button class="btn btn-primary m-1">
                    Jaga publik gruppidesse
                </button>
                <div class="d-flex">
                    <button
                        v-if="performance.active"
                        class="btn btn-outline-primary"
                        @click="
                            performanceStore.setInactivePerformance(performance)
                        "
                    >
                        Lopeta etendus
                    </button>
                    <button
                        v-else
                        class="btn btn-outline-primary"
                        @click="
                            performanceStore.setActivePerformance(performance)
                        "
                    >
                        Alusta etendust
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.performance-settings {
    margin-top: 10rem;
}
</style>
