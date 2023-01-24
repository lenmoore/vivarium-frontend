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
    await performanceStore.getCurrentPerformanceVisitors(activePerformance._id);
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
            // console.log('trying to show products');

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
let allColorScoresEver = ref({
    lime: 0,
    fuchsia: 0,
    silver: 0,
    turq: 0,
});
watch(visitors, async () => {
    // if (visitors.value[0]?.confirmed_humanity_value === 'none') {
    // await sortThemGuys();
    // }
});
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
                    class="btn btn-outline-primary font-size-xl"
                    @click="toggleViewOptions('audience')"
                >
                    Kõik
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes('products'),
                    }"
                    class="btn btn-outline-primary font-size-xl"
                    @click="toggleViewOptions('products')"
                >
                    Tooted
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes('pre'),
                    }"
                    class="btn btn-outline-primary font-size-xl"
                    @click="toggleViewOptions('quiz-pre-capsule')"
                >
                    2.-3. mäng
                </button>
                <button
                    :class="{
                        'bg-success text-white':
                            router.currentRoute.value.name.includes(
                                'in-capsule'
                            ),
                    }"
                    class="btn btn-outline-primary font-size-xl"
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
