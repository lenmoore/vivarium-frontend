<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';
import { cloneDeep } from 'lodash';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let sortedVisitors = ref([]);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color || 'all');
let mappedVisitors = ref([]);
onMounted(async () => {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);

    console.log(router.currentRoute);
    console.log('does it even..mount,', showOnlyColorRoute);
    sortedVisitors = computed(() => performanceStore.getVisitors);

    sort();
});

watch(sortedVisitors, () => {
    console.log('watsch');
    sort();
});

function sort() {
    let visitorsToMap = ref(sortedVisitors);

    mappedVisitors = visitorsToMap.value
        .map((visitor) => {
            let basket = visitor.basket;

            let redQuiz = visitor?.quiz_results
                ? visitor?.quiz_results?.map((qR) => {
                      return qR.result_humanity_values?.fuchsia;
                  })
                : [];
            let greenQuiz = visitor?.quiz_results
                ? visitor?.quiz_results?.map((qR) => {
                      return qR?.result_humanity_values?.lime;
                  })
                : [];
            let blueQuiz = visitor?.quiz_results
                ? visitor?.quiz_results?.map((qR) => {
                      return qR?.result_humanity_values?.silver;
                  })
                : [];
            let orangeQuiz = visitor?.quiz_results
                ? visitor?.quiz_results?.map((qR) => {
                      return qR?.result_humanity_values?.turq;
                  })
                : [];

            let redProducts = basket?.products?.map(
                (p) => p?.humanity_values?.fuchsia?.average || 0
            );
            let silverProducts = basket?.products?.map(
                (p) => p?.humanity_values?.blue?.average || 0
            );
            let limeProducts = basket?.products?.map(
                (p) => p?.humanity_values?.green?.average || 0
            );
            let turqProducts = basket?.products?.map(
                (p) => p?.humanity_values?.orange?.average || 0
            );

            let fuchsia = [...redQuiz, ...redProducts];
            let lime = [...greenQuiz, ...limeProducts];
            let silver = [...blueQuiz, ...silverProducts];
            let turq = [...orangeQuiz, ...turqProducts];

            let avg_hum_values = {
                fuchsia: fuchsia?.reduce((a, b) => a + b, 0),
                silver: silver?.reduce((a, b) => a + b, 0),
                turq: turq?.reduce((a, b) => a + b, 0),
                lime: lime?.reduce((a, b) => a + b, 0),
            };
            let maxKey,
                maxValue = 0;

            for (const [key, value] of Object.entries(avg_hum_values)) {
                if (value > maxValue) {
                    maxValue = value;
                    maxKey = key;
                }
            }
            let highest = maxKey;

            return {
                ...visitor,
                basket,
                highest,
                avg_hum_values,
            };
        })
        .sort((a, b) => a.wardrobe_number - b.wardrobe_number);

    instance?.proxy?.$forceUpdate();
}

const isAdmin = ref(localStorage.getItem('admin') === 'true');

setInterval(async function () {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    sort();
    instance?.proxy?.$forceUpdate();
}, 120000);

async function deleteVisitor(visitor) {
    await performanceStore.deleteVisitor(visitor);
    location.reload();
}
</script>
<template>
    <div>
        {{ mappedVisitors.length }} inimest sinu kapslis.

        <div v-if="!showOnlyColorRoute.length">
            <div>
                lime ({{ sortedVisitors.lime.size }}):
                <span
                    v-for="visitor in sortedVisitors.lime"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                fuchsia ({{ sortedVisitors.fuchsia.size }}):
                <span
                    v-for="visitor in sortedVisitors.fuchsia"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                silver ({{ sortedVisitors.silver.size }}):
                <span
                    v-for="visitor in sortedVisitors.silver"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                turq ({{ sortedVisitors.turq.size }}):
                <span
                    v-for="visitor in sortedVisitors.turq"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
        </div>
        <br />
        <div>
            <div
                v-for="visitor in mappedVisitors"
                :key="visitor._id"
                :class="'' + visitor.confirmed_humanity_value"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <span
                        ><h2 style="width: 4em">
                            {{ visitor.wardrobe_number }}
                        </h2>

                        <div v-if="isAdmin">
                            <div class="font-size-extra-super-small">
                                {{ visitor._id }}
                            </div>
                            <button
                                class="btn btn-danger font-size-extra-super-small"
                                @click="deleteVisitor(visitor)"
                            >
                                kustuta
                            </button>
                        </div>
                        <div class="font-size-extra-super-small">
                            {{ visitor.highest }} _
                            {{ visitor.algorithm_result }}
                        </div>
                    </span>

                    <div
                        class="border-top d-flex flex-column align-items-start"
                    >
                        Tooteid korvis:
                        {{ visitor.basket.products.length }},
                        <small
                            v-for="product in visitor.basket.products"
                            :key="product.title"
                            >{{ product.title }},<br />
                        </small>
                    </div>
                </div>
                <div class="border-top w-50">
                    <div>
                        Vastused: <br />
                        <small
                            v-for="result in visitor.quiz_results"
                            :key="result.result_text"
                            >{{ result.result_text }},
                        </small>
                    </div>
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.turq {
    border: 2px solid #02e5dd;
}
</style>
