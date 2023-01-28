<script setup>
import { onMounted, reactive, ref } from 'vue';
import router from '../router/index';

import { getCurrentInstance } from 'vue';
import { useVisitorStore } from '../store/visitor.store';
import { cloneDeep } from 'lodash';

const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
let summary = reactive([]);
const date = router.currentRoute.value.params.date;
let realHighestValues = reactive({});
const state = ref({
    loading: true,
    realHighestValuesReady: false,
});
let visitors = reactive([]);
onMounted(async () => {
    console.log(router.currentRoute);
    console.log(date);
    summary = await visitorStore.fetchSummaryByDate(date);
    state.value.loading = false;
    console.log(summary);
    if (summary) {
        visitors = summary?.visitors.map((visitor) => {
            console.log(visitor);
            let basket = visitor.basket;

            let redQuiz = visitor?.quiz_results
                ? visitor?.quiz_results?.map((qR) => {
                      return qR?.result_humanity_values?.fuchsia;
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

            let redProducts = [];
            let silverProducts = [];
            let limeProducts = [];
            let turqProducts = [];
            redProducts = basket?.products?.map(
                (p) => p?.humanity_values?.fuchsia?.average
            );
            silverProducts = basket?.products?.map(
                (p) => p?.humanity_values?.blue?.average
            );
            limeProducts = basket?.products?.map(
                (p) => p?.humanity_values?.green?.average
            );
            turqProducts = basket?.products?.map(
                (p) => p?.humanity_values?.orange?.average
            );

            let fuchsia = [...redQuiz, ...redProducts];
            let lime = [...greenQuiz, ...limeProducts];
            let silver = [...blueQuiz, ...silverProducts];
            let turq = [...orangeQuiz, ...turqProducts];
            let absolute_hum_values = {
                lime: lime?.reduce((a, b) => a + b, 0),
                fuchsia: fuchsia?.reduce((a, b) => a + b, 0),
                silver: silver?.reduce((a, b) => a + b, 0),
                turq: turq?.reduce((a, b) => a + b, 0),
            };

            console.log(absolute_hum_values);
            return { ...visitor, absolute_hum_values: absolute_hum_values };
        });
        instance?.proxy?.$forceUpdate();

        state.value.realHighestValuesReady = true;
    }
    realHighestValues = {
        fuchsia: countVisitorsByColor(visitors, 'fuchsia'),
    };
    console.log(visitors);
    instance?.proxy?.$forceUpdate();
});

function countVisitorsByColor(visitors, color) {
    return 10;
}
</script>

<template>
    <div v-if="!state.loading" class="container">
        <div v-if="summary">
            <h1 v-if="summary.performance">{{ summary.performance.title }}</h1>
            <div v-if="summary.visitorsWereDividedIn" class="visitors-division">
                <p>Saalis oli {{ summary.amountOfVisitors }} inimest.</p>
                <p>
                    Igasse kapslisse mahub maksimaalselt 27 inimest. <br />
                    Publik jaotati kapslitesse järgnevalt:
                </p>
                <p v-if="state.realHighestValuesReady"></p>
                <div>
                    <small class="bg-fuchsia">{{
                        summary.visitorsWereDividedIn.fuchsia
                    }}</small>
                    <small class="bg-green">{{
                        summary.visitorsWereDividedIn.lime
                    }}</small>
                    <small class="bg-orange">{{
                        summary.visitorsWereDividedIn.turq
                    }}</small>
                    <small class="bg-blue">{{
                        summary.visitorsWereDividedIn.silver
                    }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.visitors-division {
    small {
        width: 3rem;
        padding: 1rem;
    }
}
</style>
