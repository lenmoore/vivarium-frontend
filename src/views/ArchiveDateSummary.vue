<script setup>
import { onMounted, reactive, ref } from 'vue';
import router from '../router/index';

import { getCurrentInstance } from 'vue';
import { useVisitorStore } from '../store/visitor.store';
import { cloneDeep } from 'lodash';

const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
let summary = ref({});
const date = router.currentRoute.value.params.date;
const state = ref({
    loading: true,
    realHighestValuesReady: false,
    visitorsWereDividedIn: {},
    realValues: { turq: 0, fuchsia: 0, silver: 0, lime: 0 },
    humanityValuesByHighest: {},
    capsuleProducts: [],
});
let visitors = reactive([]);
onMounted(async () => {
    console.log(router.currentRoute);
    console.log(date);
    summary = await visitorStore.fetchSummaryByDate(date);
    state.value.loading = false;
    console.log('summary');
    console.log(summary);
    if (summary.value) {
        visitors = summary.value?.visitors.map((visitor) => {
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
            let sum =
                absolute_hum_values.fuchsia +
                absolute_hum_values.lime +
                absolute_hum_values.silver +
                absolute_hum_values.turq;
            let avg_hum_values = [
                {
                    color: 'lime',
                    value: absolute_hum_values?.lime / sum,
                },
                {
                    color: 'fuchsia',
                    value: absolute_hum_values?.fuchsia / sum,
                },
                {
                    color: 'turq',
                    value: absolute_hum_values?.turq / sum,
                },
                {
                    color: 'silver',
                    value: absolute_hum_values?.silver / sum,
                },
            ];
            let highest = avg_hum_values.sort(
                (a, b) => b.value - a.value
            ).color;
            console.log(state.value.realValues);
            state.value.realValues[highest] =
                state.value.realValues[highest] + 1;
            return {
                ...visitor,
                absolute_hum_values: absolute_hum_values,
                avg_hum_values,
            };
        });
        instance?.proxy?.$forceUpdate();

        state.value.realHighestValuesReady = true;
    }
    console.log('VISItors', visitors);
    instance?.proxy?.$forceUpdate();
});

function getHighestColor(avg_hum_values) {
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
            <div class="visitors-division">
                <p>Tegelik saali koosseis oli järgmine:</p>
                <div>
                    <small class="bg-fuchsia">{{
                        summary.humanityValuesByHighest.fuchsia
                    }}</small>
                    <small class="bg-green">{{
                        summary.humanityValuesByHighest.lime
                    }}</small>
                    <small class="bg-orange">{{
                        summary.humanityValuesByHighest.turq
                    }}</small>
                    <small class="bg-blue">{{
                        summary.humanityValuesByHighest.silver
                    }}</small>
                </div>
            </div>

            <br />
            <br />
            <div class="products d-flex flex-column">
                <p>Terve saal võttis kaasa kõigisse kapslitesse:</p>
                <div
                    v-for="(product, i) in summary.capsuleProducts.sort(
                        (a, b) => b.count - a.count
                    )"
                    :key="'product' + i"
                >
                    <div
                        v-if="i < 10"
                        class="d-flex align-items-center border m-1 justify-content-between"
                    >
                        <div class="d-flex flex-nowrap align-items-center">
                            <img :src="product.image" alt="" height="50" />
                            &nbsp;<small class="mx-4">{{
                                product?.title
                            }}</small>
                            {{ product.count }}x
                        </div>
                        <span class="mx-4"></span>
                        <div>
                            <span class="font-size-xs"> Kapslites: </span>
                            <small class="bg-fuchsia-light p-1 mx-1">{{
                                product.colors.fuchsia
                            }}</small>
                            <small class="bg-green p-1 mx-1">{{
                                product.colors.lime
                            }}</small>
                            <small class="bg-orange p-1 mx-1">{{
                                product.colors.turq
                            }}</small>
                            <small class="bg-blue p-1 mx-1">{{
                                product.colors.silver
                            }}</small>
                        </div>
                    </div>
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

    padding-bottom: 2rem;
}
</style>
