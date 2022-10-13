<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
const route = useRoute();
const id = route.params.id.toString();

const performanceStore = usePerformanceStore();
performanceStore.getPerformances();

const performances = computed(() => performanceStore.performances);
const performance = performances.value.find((p) => p._id === id);
</script>

<template>
    <div>
        <div v-if="performance">
            {{ performance.title }} <br />
            kuupaev: {{ performance.date }}

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
                    @click="performanceStore.setActivePerformance(performance)"
                >
                    Alusta etendust
                </button>
            </div>
            <small>
                {{ performance }}
            </small>
        </div>
    </div>
</template>
