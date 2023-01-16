<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import router from '../../router/index';
import { useVisitorStore } from '../../store/visitor.store';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
let visitor = reactive({});

let avg_hum_values = ref({});
onBeforeMount(async () => {
    console.log('GOOD MORNING TEXAS,');
    console.log(router.currentRoute.value.fullPath);
    console.log(router.currentRoute.value.fullPath);
    console.log(router.currentRoute.value.fullPath);
    console.log(router.currentRoute.value.fullPath);
    console.log(router.currentRoute.value.fullPath);
    console.log(router.currentRoute.value);
    let routeDate = router.currentRoute.value.params.date;
    let wardrobeNumber = router.currentRoute.value.params.wardrobe;

    console.log(routeDate, wardrobeNumber);

    visitor = await visitorStore.fetchVisitorByDateAndNumber(
        routeDate,
        wardrobeNumber
    );

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

        <div class="py-2">
            <p>sponsorid (TBA)</p>
        </div>

        <div class="py-2">
            <p>
                <strong>Algkontseptsiooni autorid</strong>: Helen Rekkor, Villem
                Rootalu, Sander Põldsaar, Mihkel Seeder
            </p>
            <br />
            <p><strong>Lavastaja</strong>: Helen Rekkor</p>
            <p><strong>Dramaturg</strong>: Mihkel Seeder</p>
            <p><strong>Arendaja</strong>: Helena Väinmaa</p>
            <p><strong>Videokunstnik</strong>: Sander Põldsaar</p>
            <p><strong>Helilooja</strong>: Villem Rootalu</p>
            <p><strong>Valguskunstnik</strong>: Rommi Ruttas</p>
            <br />
            <p><strong>Tehnik</strong>: Martin Koldits</p>
            <p><strong>Tehnilised lahendused</strong>: Raul Õitspuu</p>
            <p>
                <strong>Praktikant</strong>: Rebecca Tamm (TÜVKA
                kultuurikorralduse eriala)
            </p>
            <br />
            <p>
                <strong
                    >Esietendus 18. jaanuaril 2023 Sakala 3 Teatrimajas</strong
                >
            </p>
            <p><strong>Täname</strong>: Andero Uusberg, Elisabeth Rebane</p>
        </div>

        <h3 class="pt-4">Osades:</h3>
        <div class="py-2">
            VIOLETT – Merilin Kirbits (Improteater IMPEERIUM) <br />
            TÜRKIIS – Maarja Tammemägi <br />
            LAIM – Meelis Põdersoo <br />
            HÕBEVALGE – Tanel Saar <br />
            ADMINISTRAATOR – Helen Rekkor <br />
        </div>
        <br />
        <br />
        <br />

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
            <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                Math.floor(avg_hum_values.fuchsia)
            }}</small>
            <small class="font-size-xs bg-green p-1 m-1">{{
                Math.floor(avg_hum_values.lime)
            }}</small>
            <small class="font-size-xs bg-orange p-1 m-1">{{
                Math.floor(avg_hum_values.turq)
            }}</small>
            <small class="font-size-xs bg-blue p-1 m-1">{{
                Math.floor(avg_hum_values.silver)
            }}</small>
        </div>
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
                    &nbsp;<small>{{ res.title }}</small>
                </div>
            </div>
        </div>

        <div
            v-if="
                visitor && visitor.quiz_results && visitor.quiz_results.length
            "
            class="py-4"
        >
            <h4>Tegid järgmised valikud:</h4>
            <div
                v-for="(res, i) in visitor.quiz_results"
                :key="'selected' + i"
                class="border mb-1"
            >
                <strong>{{ res.step.question_text }}</strong>
                {{ res.result_text }}
            </div>
        </div>

        <div>koduleht: <a href="www.vatteater.ee">www.vatteater.ee</a></div>
        <div>
            E-post: <a href="vat@vatteater.ee" type="email">vat@vatteater.ee</a>
        </div>
        <div>
            Leia meid
            <a href="https://www.facebook.com/teatervat">Facebookist</a>,
            <a href="https://www.instagram.com/vatteater/">Instagramist</a>, Tik
            Tokist
        </div>
    </div>
</template>
