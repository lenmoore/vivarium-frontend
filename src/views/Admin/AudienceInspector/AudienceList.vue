<script setup>
import { usePerformanceStore } from '../../../store/performance.store';
import { computed, onBeforeMount, ref, reactive, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import router from '../../../router/index';

const performanceStore = usePerformanceStore();
const humanityStore = useHumanityShopStore();

const isAdmin = ref(localStorage.getItem('admin') === 'true');

let showSummaryList = ref(router.currentRoute.value.query.showSummary);
let showOnlyColorRoute = ref(router.currentRoute.value.query.color);
let showProductsSummary = ref(router.currentRoute.value.query.products);
let showPreCapsuleQuizzes = ref(router.currentRoute.value.query.preCapsuleQuiz);
let showCapsuleQuizzes = ref(router.currentRoute.value.query.capsuleQuiz);

let viewOptions = ref({
    showSummaryList: showSummaryList.value === 'yes',
    showProductsSummary: showProductsSummary.value === 'yes',
    showQuizSummaryInCapsule: showCapsuleQuizzes.value === 'yes',
    showQuizSummaryPreCapsule: showPreCapsuleQuizzes.value === 'yes',
    ready: false,
});

let activePerformance = {};
onBeforeMount(async () => {
    activePerformance = computed(() => {
        return performanceStore.getActivePerformance;
    });
    // await humanityStore.fetchProducts();
});

const baskets = computed(() => humanityStore.getBaskets);
let showOnlyColor = ref(localStorage.getItem('actor_color'));

let visitors = computed(() => performanceStore.getVisitors);

function toggleViewOptions(show) {
    let query = {
        color: showOnlyColorRoute.value || showOnlyColor.value,
    };
    let name = '';
    switch (show) {
        case 'products':
            console.log('trying to show products');

            name = 'admin.audience.products';

            break;
        case 'quiz-in-capsule':
            name = 'admin.audience.quiz-in-capsule';
            break;
        case 'quiz-pre-capsule':
            name = 'admin.audience.quiz-pre-capsule';
            break;
        case 'audience':
        default:
            name = 'admin.audience.overview';
            break;
    }
    router.push({ name: name, query });
}

let countedProducts = ref([]);
let mappedVisitors = reactive([]);
let coolAlgorithmedVisitors = reactive({});

watch(visitors, async () => {
    if (visitors.value[0]?.confirmed_humanity_value === 'none') {
        await sortThemGuys();
    }
});

async function sortThemGuys() {
    coolAlgorithmedVisitors = reactive({});
    let visitorsToMap = ref(visitors.value);
    countedProducts = ref([]);
    mappedVisitors = reactive([]);
    coolAlgorithmedVisitors = {
        turq: new Set(),
        fuchsia: new Set(),
        silver: new Set(),
        lime: new Set(),
    };

    mappedVisitors = visitorsToMap.value.map((visitor) => {
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
            (p) => p.humanity_values?.fuchsia?.average
        );
        let silverProducts = basket?.products?.map(
            (p) => p.humanity_values?.blue?.average
        );
        let limeProducts = basket?.products?.map(
            (p) => p.humanity_values?.green?.average
        );
        let turqProducts = basket?.products?.map(
            (p) => p.humanity_values?.orange?.average
        );

        let fuchsia = [...redQuiz, ...redProducts];
        let lime = [...greenQuiz, ...limeProducts];
        let silver = [...blueQuiz, ...silverProducts];
        let turq = [...orangeQuiz, ...turqProducts];

        let avg_hum_values = {
            lime: lime?.reduce((a, b) => a + b, 0),
            fuchsia: fuchsia?.reduce((a, b) => a + b, 0),
            silver: silver?.reduce((a, b) => a + b, 0),
            turq: turq?.reduce((a, b) => a + b, 0),
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
    });

    // games = computed(() => performanceStore.games);
    // gamesPreCapsule = games.value.filter(
    //     (g) => g.pre_capsule && g.game_type !== 'SHOP'
    // );
    // gamesInCapsule = games.value.filter(
    //     (g) => !g.pre_capsule && g.game_type !== 'SHOP'
    // );
    //
    // let color = {
    //     turq: 'orange',
    //     fuchsia: 'fuchsia',
    //     silver: 'blue',
    //     lime: 'green',
    // }[showOnlyColorRoute.value || 'all'];
    // games = games.value.filter(
    //     (g) =>
    //         g.open_for_colors.includes(color) && g.open_for_colors.length === 1
    // );
    let peopleCountModulo = visitors.value.length % 4;

    let peopleCount = (visitors.value.length - peopleCountModulo) / 4;
    let notYetSomewhere = new Set(mappedVisitors);
    // console.log(notYetSomewhere);
    dividePeople();

    function firstSort(color) {
        let sortedByColor = mappedVisitors.sort(
            (a, b) => b.avg_hum_values[color] - a.avg_hum_values[color]
        );
        for (let i = 0; i < peopleCount / 3; i++) {
            if (
                notYetSomewhere.has(sortedByColor[i]) &&
                sortedByColor[i]?.highest === color &&
                coolAlgorithmedVisitors[color]?.size < peopleCount / 3
            ) {
                addToAlgorithmedVisitors(color, sortedByColor[i]);
            }
        }
    }

    function dividePeople() {
        // first do some division of extremists
        ['silver', 'fuchsia', 'turq', 'lime'].forEach((color) =>
            firstSort(color)
        );

        while (notYetSomewhere.size) {
            notYetSomewhere.forEach((silverGuy) => {
                let maxKey = '';
                let maxValue = 0;
                for (const [key, value] of Object.entries(
                    silverGuy.avg_hum_values
                )) {
                    if (value > maxValue) {
                        maxValue = value;
                        maxKey = key;
                    }
                }
                // console.log(peopleCount + peopleCountModulo, 'max size');
                // console.log(coolAlgorithmedVisitors[maxKey].size);

                if (
                    maxKey.length &&
                    coolAlgorithmedVisitors[maxKey]?.size <= peopleCount
                ) {
                    // console.log('maxkey is ', maxKey);
                    addToAlgorithmedVisitors(maxKey, silverGuy);
                } else {
                    // console.log(
                    //     'fuck couldnt be added anywhere -- firstvalue ',
                    //     maxKey
                    // );
                    let secondMaxValue = Object.entries(
                        silverGuy.avg_hum_values
                    ).sort((a, b) => a - b)[1];
                    // console.log('secondMaxValue', secondMaxValue);
                    if (
                        secondMaxValue.length &&
                        coolAlgorithmedVisitors[secondMaxValue[0]]?.size <=
                            peopleCount
                    ) {
                        addToAlgorithmedVisitors(secondMaxValue[0], silverGuy);
                    } else {
                        // console.log(
                        //     'fuck couldnt be added anywhere -- secondmaxvalue ',
                        //     secondMaxValue
                        // );
                        let thirdMaxValue = Object.entries(
                            silverGuy.avg_hum_values
                        ).sort((a, b) => a - b)[2];
                        // console.log('thirdMaxValue', thirdMaxValue);
                        if (
                            thirdMaxValue.length &&
                            coolAlgorithmedVisitors[thirdMaxValue[0]]?.size <=
                                peopleCount
                        ) {
                            addToAlgorithmedVisitors(
                                thirdMaxValue[0],
                                silverGuy
                            );
                        } else {
                            let fourthMaxValue = Object.entries(
                                silverGuy.avg_hum_values
                            ).sort((a, b) => a - b)[3];

                            addToAlgorithmedVisitors(
                                fourthMaxValue[0],
                                silverGuy
                            );
                        }
                    }
                }
            });
        }
    }

    function addToAlgorithmedVisitors(maxKey, visitor) {
        coolAlgorithmedVisitors[maxKey]?.add(visitor);
        visitor.algorithm_result = maxKey;
        notYetSomewhere.delete(visitor);
    }

    console.log(coolAlgorithmedVisitors);
    viewOptions.value.ready = true;
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

    await performanceStore.updateVisitors(viiiiis);
    // location.reload();
}

setTimeout(async () => {
    console.log('reloading actor view');
    console.log(activePerformance);
    await performanceStore.getCurrentPerformanceVisitors(
        activePerformance.value._id
    );
    visitors = computed(() => performanceStore.getVisitors);
}, 12000);
</script>

<template>
    <div class="my-4">
        <div
            v-if="isAdmin"
            class="d-flex justify-content-around align-items-center"
        >
            <RouterLink
                :to="{ name: 'admin.audience.overview', query: {} }"
                class="mx-2"
                >Publik kõik
            </RouterLink>
            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'turq' }"
                :to="{
                    name: 'admin.audience.overview',
                    query: { color: 'turq' },
                }"
                class="mx-2 p-2"
                style="background-color: paleturquoise"
                @click="sortThemGuys"
            >
                Türkiis
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'fuchsia' }"
                :to="{
                    name: 'admin.audience.overview',
                    query: { color: 'fuchsia' },
                }"
                class="mx-2 p-2"
                style="background-color: lightpink"
                @click="sortThemGuys"
            >
                Violett
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'silver' }"
                :to="{
                    name: 'admin.audience.overview',
                    query: { color: 'silver' },
                }"
                class="mx-2 p-2"
                style="background-color: silver"
                @click="sortThemGuys"
            >
                Hõbevalge
            </RouterLink>

            <RouterLink
                :class="{ 'font-size-xl': showOnlyColorRoute === 'lime' }"
                :to="{
                    name: 'admin.audience.overview',
                    query: { color: 'lime' },
                }"
                class="mx-2 p-2"
                style="background-color: lime"
                @click="sortThemGuys"
            >
                Laim
            </RouterLink>
        </div>

        <div v-if="visitors && baskets">
            <div class="d-flex align-items-center justify-content-around">
                <button
                    :class="{
                        'bg-success text-white': viewOptions.showSummaryList,
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('audience')"
                >
                    Kõik
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes('products'),
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('products')"
                >
                    Tooted kaasas
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes('pre'),
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-pre-capsule')"
                >
                    2. ja 3. mäng
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes(
                                'in-capsule'
                            ),
                    }"
                    class="btn btn-outline-primary"
                    @click="toggleViewOptions('quiz-in-capsule')"
                >
                    Kapslimängud
                </button>
            </div>
            <!--            <div>-->
            <RouterView :key="$route.fullPath" />
            <!--                <div v-if="viewOptions.showSummaryList" class="visitors">-->
            <!--                    {{ visitors.length }} inimest teatris. Eeldatav kapsli-->
            <!--                    suurus: {{ Math.floor(visitors.length / 4) }} +- 3-->
            <!--                <AudienceSummary-->
            <!--                    :color="showOnlyColorRoute || showOnlyColor"-->
            <!--                    :cool-algorithmed-visitors="coolAlgorithmedVisitors"-->
            <!--                />-->
            <!--                <div-->
            <!--                    v-for="visitor in coolAlgorithmedVisitors.silver"-->
            <!--                    :key="visitor._id"-->
            <!--                    :class="visitor.confirmed_humanity_value"-->
            <!--                    class="visitor-wrapper mt-2 text-center d-flex justify-content-between"-->
            <!--                >-->
            <!--                    <div class="d-flex">-->
            <!--                        <span-->
            <!--                            ><h2 style="width: 4em">-->
            <!--                                {{ visitor.wardrobe_number }}-->
            <!--                            </h2>-->
            <!--                            <div class="font-size-extra-super-small">-->
            <!--                                {{ visitor.highest }} _-->
            <!--                                {{ visitor.algorithm_result }}-->
            <!--                            </div></span-->
            <!--                        >-->

            <!--                        <div-->
            <!--                            class="border-top d-flex flex-column align-items-start"-->
            <!--                        >-->
            <!--                            Tooteid korvis:-->
            <!--                            {{ visitor.basket.products.length }},-->
            <!--                            <small-->
            <!--                                v-for="product in visitor.basket.products"-->
            <!--                                :key="product.title"-->
            <!--                                >{{ product.title }},<br />-->
            <!--                            </small>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                    <div class="border-top w-50">-->
            <!--                        <div>-->
            <!--                            Vastused: <br />-->
            <!--                            <small-->
            <!--                                v-for="result in visitor.quiz_results"-->
            <!--                                :key="result.result_text"-->
            <!--                                >{{ result.result_text }},-->
            <!--                            </small>-->
            <!--                        </div>-->
            <!--                        <div>-->
            <!--                            <small class="font-size-xs bg-fuchsia p-1 m-1">{{-->
            <!--                                Math.floor(visitor.avg_hum_values.fuchsia)-->
            <!--                            }}</small>-->
            <!--                            <small class="font-size-xs bg-green p-1 m-1">{{-->
            <!--                                Math.floor(visitor.avg_hum_values.lime)-->
            <!--                            }}</small>-->
            <!--                            <small class="font-size-xs bg-orange p-1 m-1">{{-->
            <!--                                Math.floor(visitor.avg_hum_values.turq)-->
            <!--                            }}</small>-->
            <!--                            <small class="font-size-xs bg-blue p-1 m-1">{{-->
            <!--                                Math.floor(visitor.avg_hum_values.silver)-->
            <!--                            }}</small>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                    &lt;!&ndash;                </div>&ndash;&gt;-->
            <!--                    &lt;!&ndash;                <div&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    v-else-if="&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        viewOptions.showProductsSummary && countedProducts&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    "&ndash;&gt;-->
            <!--                    &lt;!&ndash;                >&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    <ProductsSummary&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :color="showOnlyColorRoute || showOnlyColor"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    />&ndash;&gt;-->
            <!--                    &lt;!&ndash;                </div>&ndash;&gt;-->
            <!--                    &lt;!&ndash;                <div v-else-if="viewOptions.showQuizSummaryInCapsule">&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    <QuizSummary&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :color="showOnlyColorRoute || showOnlyColor"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :games="gamesInCapsule"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    />&ndash;&gt;-->
            <!--                    &lt;!&ndash;                </div>&ndash;&gt;-->
            <!--                    &lt;!&ndash;                <div v-else-if="viewOptions.showQuizSummaryPreCapsule">&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    <QuizSummary&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :color="showOnlyColorRoute || showOnlyColor"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :cool-algorithmed-visitors="coolAlgorithmedVisitors"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        :games="gamesPreCapsule"&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    />&ndash;&gt;-->
            <!--                    &lt;!&ndash;                </div>&ndash;&gt;-->
            <!--                </div>-->
            <!--            </div>-->
            <div v-if="isAdmin">
                <h4 style="margin-top: 20rem">
                    Ära vajuta neid nuppe, kui sul siia asja pole. Helena paneb
                    need hiljem peitu
                </h4>
                <div>
                    <button class="btn btn-primary" @click="confirmColors">
                        pane värvid lukku
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fuchsia,
.silver,
.turq,
.lime {
    &.router-link-exact-active {
        font-size: 2rem;
    }
}
</style>
