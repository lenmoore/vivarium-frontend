<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import router from '../../router/index';
import { useVisitorStore } from '../../store/visitor.store';
import { usePerformanceStore } from '../../store/performance.store';
import { getCurrentInstance } from 'vue';
import ProductsSummary from '../Admin/AudienceInspector/ProductsSummary.vue';

const performanceStore = usePerformanceStore();
const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
let visitor = reactive({});

const jahEiGame = '63bef97628a69a85e5bb45d5';
const otherPreCapsuleGame = '63bef98d28a69a85e5bb45e0';
const lifeInCapsule = [
    '63bf20cd28a69a85e5bb4d80',
    '63bf20dd28a69a85e5bb4d88',
    '63bf20eb28a69a85e5bb4d91',
    '63bf20f728a69a85e5bb4d99',
];

const worldViewQuestions = [
    '63bf213828a69a85e5bb4da2',
    '63bf215928a69a85e5bb4db7',
    '63bf217428a69a85e5bb4dcb',
    '63bf21bb28a69a85e5bb4df4',
];
const guiltyAndAgentQuestions = [
    '63bf21f128a69a85e5bb4e09',
    '63bf221028a69a85e5bb4e1e',
    '63bf231a28a69a85e5bb4ea0',
    '63bf233828a69a85e5bb4eb5',
    '63bf22d428a69a85e5bb4e8b',
    '63bf226528a69a85e5bb4e4c',
    '63bf22a928a69a85e5bb4e77',
    '63bf224228a69a85e5bb4e32',
];
const humanityQuestions = [
    '63bf237928a69a85e5bb4ec9',
    '63bf238628a69a85e5bb4ed1',
    '63bf23a228a69a85e5bb4ee1',
    '63bf239328a69a85e5bb4ed9',
];
let sum = ref(0);
let visitorQuizResultsSortedByGame = ref([]);
let avg_hum_values = ref({});
onBeforeMount(async () => {
    // console.log('GOOD MORNING TEXAS,');
    // console.log(router.currentRoute.value);
    let routeDate = router.currentRoute.value.params.date;
    let wardrobeNumber = router.currentRoute.value.params.wardrobe;

    // console.log(routeDate, wardrobeNumber);

    await performanceStore.getGames();
    visitor = await visitorStore.fetchVisitorByDateAndNumber(
        routeDate,
        wardrobeNumber
    );
    let games = computed(() => performanceStore.getGames);
    console.log('games-', games);

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

    avg_hum_values = {
        fuchsia: fuchsia?.reduce((a, b) => a + b, 0),
        silver: silver?.reduce((a, b) => a + b, 0),
        turq: turq?.reduce((a, b) => a + b, 0),
        lime: lime?.reduce((a, b) => a + b, 0),
    };

    instance?.proxy?.$forceUpdate();

    console.log(visitor);
});
</script>

<template>
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <h1 class="h1-color text-decoration-none">VIVAARIUM</h1>
            <img src="/public/img.png" width="60" />
        </div>

        <h2>Kellena homsesse?</h2>
        <br />
        <h2
            :class="
                {
                    turq: 'bg-orange',
                    fuchsia: 'bg-fuchsia',
                    silver: 'bg-blue',
                    lime: 'bg-green',
                }[visitor.confirmed_humanity_value]
            "
            class="p-2 text-center"
        >
            ID_{{ visitor.wardrobe_number }}_{{
                {
                    turq: 'Türkiis',
                    fuchsia: 'Violett',
                    silver: 'Hõbevalge',
                    lime: 'Laim',
                }[visitor.confirmed_humanity_value]
            }}
        </h2>

        <div class="py-2 text-center">
            Sinu tulemus:
            <div class="font-size-xs bg-fuchsia-light p-1 m-1">
                {{
                    Math.round(
                        (avg_hum_values.fuchsia /
                            (avg_hum_values.turq +
                                avg_hum_values.fuchsia +
                                avg_hum_values.silver +
                                avg_hum_values.lime)) *
                            10000
                    ) / 100
                }}%
            </div>
            <div class="font-size-xs bg-green p-1 m-1">
                {{
                    Math.round(
                        (avg_hum_values.lime /
                            (avg_hum_values.turq +
                                avg_hum_values.fuchsia +
                                avg_hum_values.silver +
                                avg_hum_values.lime)) *
                            10000
                    ) / 100
                }}%
            </div>
            <div class="font-size-xs bg-orange p-1 m-1">
                {{
                    Math.round(
                        (avg_hum_values.turq /
                            (avg_hum_values.turq +
                                avg_hum_values.fuchsia +
                                avg_hum_values.silver +
                                avg_hum_values.lime)) *
                            10000
                    ) / 100
                }}%
            </div>
            <div class="font-size-xs bg-blue p-1 m-1">
                {{
                    Math.round(
                        (avg_hum_values.silver /
                            (avg_hum_values.turq +
                                avg_hum_values.fuchsia +
                                avg_hum_values.silver +
                                avg_hum_values.lime)) *
                            10000
                    ) / 100
                }}%
            </div>
        </div>
        <h3>
            Vivaariumis jagati publik nelja inimgruppi. Need otsused tehti
            järgnevate valikute põhjal:
        </h3>
        <div>
            <h4>Võtsid kapslisse kaasa:</h4>

            <div class="d-flex flex-column">
                <div
                    v-for="(res, i) in visitor.basket &&
                    visitor.basket.products"
                    :key="'product' + i"
                    class="d-flex align-items-center border m-1"
                >
                    <img :src="res.image" alt="" height="50" />
                    &nbsp;<small>{{ res?.title }}</small>
                </div>
            </div>
        </div>

        <div
            v-if="
                visitor && visitor.quiz_results && visitor.quiz_results.length
            "
            class="py-4"
        >
            <h4>Sind kapslisse määranud valikud:</h4>
            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        (res?.game === jahEiGame ||
                            res?.game === otherPreCapsuleGame)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>

            <h4 class="pt-4">Kapslis iseloomustasid sind järgnevad valikud:</h4>

            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        lifeInCapsule.includes(res.game)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>

            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        worldViewQuestions.includes(res.game)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>

            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        worldViewQuestions.includes(res.game)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>
            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        guiltyAndAgentQuestions.includes(res.game)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>
            Ja...
            <div v-for="(res, i) in visitor.quiz_results" :key="'selected' + i">
                <div
                    v-if="
                        res.result_text !== '-' &&
                        humanityQuestions.includes(res.game)
                    "
                    class="border mb-1"
                >
                    <strong>{{ res?.step?.question_text }}</strong>
                    {{ res?.result_text }}
                </div>
            </div>
        </div>

        <br /><br /><br />

        <br /><br /><br /><br />
        <img
            alt=""
            class="py-2"
            height="150"
            src="/public/sponsors/VAT_Teater_vertikaalne_logo_va╠êrviline_RGB.png"
        />

        <div class="py-2">
            koduleht: <a href="www.vatteater.ee">www.vatteater.ee</a>
        </div>
        <div class="py-2">
            E-post: <a href="vat@vatteater.ee" type="email">vat@vatteater.ee</a>
        </div>
        <div class="py-2">
            Leia meid
            <a href="https://www.facebook.com/teatervat">Facebookist</a>,
            <a href="https://www.instagram.com/vatteater/">Instagramist</a>, Tik
            Tokist
        </div>
    </div>
</template>

<style>
.bg-fuchsia-light {
    background-color: violet;
}
</style>
