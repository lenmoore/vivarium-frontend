<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';
import { cloneDeep } from 'lodash';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();

let countedProducts = ref([]);
let mappedVisitors = ref([]);
let coolAlgorithmedVisitors = reactive({});
let allColorScoresEver = ref({
    lime: 0,
    fuchsia: 0,
    silver: 0,
    turq: 0,
});

let sortedVisitors = ref([]);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color || 'all');
onMounted(async () => {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    sortedVisitors = computed(() => performanceStore.getVisitors);
    await sort();
});

// watch(sortedVisitors, () => {
//     console.log('watsch');
//     sort();
// });
const isAdmin = ref(localStorage.getItem('admin') === 'true');

async function sort() {
    let visitorsToMap = ref(sortedVisitors.value);
    console.log(showOnlyColorRoute);
    if (showOnlyColorRoute.value !== 'all') {
        console.log('ok');
        visitorsToMap.value = visitorsToMap.value.filter(
            (vis) => vis.confirmed_humanity_value === showOnlyColorRoute.value
        );
        mappedVisitors = ref(await mapVisitors(visitorsToMap));
        console.log(mappedVisitors);
    }
    console.log(visitorsToMap);
    if (isAdmin.value) {
        console.log('am admin');
        await sortThemGuys();
    }
    console.log(mappedVisitors);
    instance?.proxy?.$forceUpdate();
}

setInterval(async function () {
    await performanceStore.getActorCapsuleVisitors(showOnlyColorRoute.value);
    await sort();
    instance?.proxy?.$forceUpdate();
}, 120000);

async function deleteVisitor(visitor) {
    await performanceStore.deleteVisitor(visitor);
    location.reload();
}

async function mapVisitors(visitorsToMap) {
    return visitorsToMap.value
        .map((visitor) => {
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

            let redProducts = basket?.products?.map(
                (p) => p?.humanity_values?.fuchsia?.average
            );
            let silverProducts = basket?.products?.map(
                (p) => p?.humanity_values?.blue?.average
            );
            let limeProducts = basket?.products?.map(
                (p) => p?.humanity_values?.green?.average
            );
            let turqProducts = basket?.products?.map(
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

            if (typeof absolute_hum_values.fuchsia !== 'number') {
                console.log(absolute_hum_values);
            }
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
            // console.log(avg_hum_values);
            //
            // let maxKey,
            //     maxValue = 0;
            //
            // for (const [key, value] of Object.entries(avg_hum_values)) {
            //     if (value > maxValue) {
            //         maxValue = value;
            //         maxKey = key;
            //     }
            // }
            let highest = avg_hum_values.sort(
                (a, b) => b.value - a.value
            ).color;

            allColorScoresEver.value.fuchsia +=
                absolute_hum_values?.fuchsia || 0;
            allColorScoresEver.value.lime += absolute_hum_values?.lime || 0;
            allColorScoresEver.value.silver += absolute_hum_values?.silver || 0;
            allColorScoresEver.value.turq += absolute_hum_values?.turq || 0;

            return {
                ...visitor,
                basket,
                highest,
                avg_hum_values,
            };
        })
        .sort((a, b) => a.wardrobe_number - b.wardrobe_number);
}

async function sortThemGuys() {
    coolAlgorithmedVisitors = reactive({});
    let visitorsToMap = ref(sortedVisitors);
    countedProducts = ref([]);
    // mappedVisitors = reactive([]);
    coolAlgorithmedVisitors = {
        turq: new Set(),
        fuchsia: new Set(),
        silver: new Set(),
        lime: new Set(),
    };

    mappedVisitors = ref(await mapVisitors(visitorsToMap));
    let peopleCountModulo = sortedVisitors.value.length % 4;

    let peopleCount = (sortedVisitors.value.length - peopleCountModulo) / 4;
    let notYetSomewhere = new Set(mappedVisitors.value);
    // console.log(notYetSomewhere);
    dividePeople();

    // console.log(visitorsToMap);

    function firstSort(color) {
        // console.log(mappedVisitors);
        let sortedByColor = mappedVisitors.value.sort(
            (a, b) => b.avg_hum_values[color] - a.avg_hum_values[color]
        );
        for (let i = 0; i < peopleCount / 3; i++) {
            if (
                notYetSomewhere.has(sortedByColor[i]) &&
                sortedByColor[i]?.highest === color &&
                coolAlgorithmedVisitors[color]?.size < 26
            ) {
                addToAlgorithmedVisitors(color, sortedByColor[i]);
            }
        }
    }

    function dividePeople() {
        // first do some division of extremists
        ['fuchsia', 'silver', 'turq', 'silver'].forEach((color) =>
            firstSort(color)
        );
        ['turq', 'lime', 'silver', 'fuchsia'].forEach((color) =>
            firstSort(color)
        );
        ['turq', 'lime', 'fuchsia', 'silver'].forEach((color) =>
            firstSort(color)
        );
        ['lime', 'fuchsia', 'turq', 'silver'].forEach((color) =>
            firstSort(color)
        );

        while (notYetSomewhere.size) {
            notYetSomewhere.forEach((silverGuy) => {
                // console.log('________');
                // console.log('________');
                // console.log('________');
                // console.log('________');
                // console.log(
                //     'ok trying to add one person',
                //     silverGuy.wardrobe_number,
                //     silverGuy.avg_hum_values
                // );
                let maxKey = silverGuy.avg_hum_values[0].color;
                silverGuy.highest = maxKey;
                if (coolAlgorithmedVisitors[maxKey]?.size <= 26) {
                    addToAlgorithmedVisitors(maxKey, silverGuy);
                } else {
                    // console.log(
                    //     'fuck couldnt be added anywhere -- firstvalue ',
                    //     maxKey
                    // );
                    let secondMaxValue = silverGuy.avg_hum_values[1].color;
                    console.log('secondMaxValue', secondMaxValue);
                    if (
                        secondMaxValue.length &&
                        coolAlgorithmedVisitors[secondMaxValue]?.size <= 26
                    ) {
                        addToAlgorithmedVisitors(secondMaxValue, silverGuy);
                    } else {
                        // console.log(
                        //     'fuck couldnt be added anywhere -- secondmaxvalue ',
                        //     secondMaxValue
                        // );
                        let thirdMaxValue = silverGuy.avg_hum_values[2].color;
                        // console.log('thirdMaxValue', thirdMaxValue);
                        if (
                            thirdMaxValue.length &&
                            coolAlgorithmedVisitors[thirdMaxValue]?.size <= 26
                        ) {
                            addToAlgorithmedVisitors(thirdMaxValue, silverGuy);
                        } else {
                            let fourthMaxValue =
                                silverGuy.avg_hum_values[3].color;

                            // console.log('fourthmaxvalue', fourthMaxValue);
                            addToAlgorithmedVisitors(fourthMaxValue, silverGuy);
                        }
                    }
                }
            });
        }
    }

    function addToAlgorithmedVisitors(maxKey, visitor) {
        visitor.algorithm_result = maxKey;
        coolAlgorithmedVisitors[maxKey]?.add(visitor);
        // console.log(maxKey);
        notYetSomewhere.delete(visitor);
    }

    console.log('>>>>>', coolAlgorithmedVisitors);
    return coolAlgorithmedVisitors;
    // viewOptions.value.ready = true;
}

async function confirmColors() {
    let viiiiis = [];

    coolAlgorithmedVisitors.lime?.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'lime',
        });
        // }
    });
    coolAlgorithmedVisitors.silver?.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'silver',
        });
        // }
    });
    coolAlgorithmedVisitors.turq?.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'turq',
        });
        // }
    });
    coolAlgorithmedVisitors.fuchsia?.forEach((visitor) => {
        // if (
        //     visitor.confirmed_humanity_value === 'none' ||
        //     !visitor.confirmed_humanity_value
        // ) {
        viiiiis.push({
            ...visitor,
            confirmed_humanity_value: 'fuchsia',
        });
        // }
    });

    // console.log(viiiiis);
    await performanceStore.updateVisitors(viiiiis);
    location.reload();
}
</script>
<template>
    <div>
        <!--        <div v-if="isAdmin">-->
        <!--    {{ // allColorScoresEver  }}-->
        <!--        </div>-->
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
                            <div class="font-size-extra-super-small">
                                highest: {{ visitor.highest }} ;
                                <br />algorithm:
                                {{ visitor.algorithm_result }}
                            </div>
                            <div
                                v-if="
                                    visitor.highest !== visitor.algorithm_result
                                "
                            >
                                Ei mahtunud
                            </div>
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
                        <small
                            v-for="humValue in visitor.avg_hum_values"
                            :key="visitor._id + '_' + humValue.color"
                            :class="
                                {
                                    turq: 'bg-orange',
                                    fuchsia: 'bg-fuchsia-light',
                                    silver: 'bg-blue',
                                    lime: 'bg-green',
                                }[humValue.color]
                            "
                            class="font-size-xs p-1 m-1"
                        >
                            {{ Math.round(humValue.value * 10000) / 100 }}%
                        </small>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isAdmin">
            <h4 style="margin-top: 20rem">
                Ära vajuta neid nuppe, kui sul siia asja pole. Helena paneb need
                hiljem peitu
            </h4>
            <div>
                <button class="btn btn-primary" @click="confirmColors">
                    pane värvid lukku
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.turq {
    border: 2px solid #02e5dd;
}

.bg-fuchsia-light {
    background-color: violet;
}
</style>
