<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
import PhaseManager from './components/PhaseManager.vue';

const route = useRoute();
const id = route.params.id;

const performanceStore = usePerformanceStore();
performanceStore.getPhases();
performanceStore.getPerformances();
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
                <div class="d-flex">
                    <button
                        class="btn"
                        v-if="performance.active"
                        @click="
                            performanceStore.setInactivePerformance(performance)
                        "
                    >
                        Lopeta etendus
                    </button>
                    <button
                        v-else
                        class="btn"
                        @click="
                            performanceStore.setActivePerformance(performance)
                        "
                    >
                        Alusta etendust
                    </button>
                </div>
            </div>

            <small>
                {{ performance }}
            </small>
        </div>
    </div>
</template>
