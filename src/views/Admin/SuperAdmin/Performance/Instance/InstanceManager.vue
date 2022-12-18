<script setup>
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import PhaseManager from './components/PhaseManager.vue';
import { usePerformanceStore } from '../../../../../store/performance.store';

const route = useRoute();
const id = route.params.id;

const performanceStore = usePerformanceStore();
onBeforeMount(async () => {
    await performanceStore.getPhases();
    await performanceStore.getPerformances();
    const activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance.value._id
    );
});

const performances = computed(() => performanceStore.performances);
const phases = computed(() => performanceStore.phases);

const performance = performances.value.find((p) => p._id === id);

performanceStore.getPerformanceById(id);

async function archiveAudienceMembers() {
    return await performanceStore.archiveWholeAudience(performance);
}
</script>

<template>
    <div>
        <div v-if="performance._id">
            <h1>
                {{ performance.title }}
            </h1>
            {{ performance.date.split('T')[0] }}

            <div class="pt-4">
                <h2>Faasid</h2>
                <PhaseManager :phases="phases" />
            </div>

            <div class="performance-settings">
                <h3>Seaded</h3>
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
                    <button
                        class="btn btn-primary"
                        @click="archiveAudienceMembers"
                    >
                        Arhiveeri kogu publik
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
