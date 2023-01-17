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
        <div
            class="py-2 border-top d-flex align-items-center justify-content-between"
        >
            <img
                alt=""
                height="60"
                src="/public/sponsors/Play_on_website_logo_01.png"
            />
            <img alt="" height="20" src="/public/sponsors/logo_obando.gif" />
        </div>

        <div class="py-2 d-flex justify-content-center">
            <img alt="" src="/public/sponsors/EUfundingLogo-320x50.png" />
        </div>
        <p class="font-size-xs text-center">
            Lavastus on sündinud rahvusvahelise teatriprojekti „PlayOn!” raames
            ja koostöös O Bando teatriga (Portugal)
        </p>
        <br /><br />

        <div class="py-2">
            <p>
                <strong>Algkontseptsiooni autorid</strong>: Helen Rekkor, Villem
                Rootalu, Sander Põldsaar, Mihkel Seeder
            </p>
            <br />
            <p>
                <strong>Lavastaja</strong>: Helen Rekkor (teatriühendus
                Misanzen)
            </p>
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
            <p>
                <strong>Täname</strong>: Andero Uusberg, Elisabeth Rebane, Tartu
                Uus Teater
            </p>
        </div>

        <h3 class="pt-4">Osades:</h3>
        <div class="py-2">
            <span class="bg-fuchsia px-2">VIOLETT</span> – Merilin Kirbits
            <small> (Improteater IMPEERIUM)</small> <br />
            <span class="bg-orange px-2">TÜRKIIS</span> – Maarja Tammemägi
            <br />
            <span class="bg-green px-2">LAIM</span> – Meelis Põdersoo <br />
            <span class="bg-blue px-2">HÕBEVALGE</span> – Tanel Saar <br />
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

        <br /><br /><br />
        <div class="">
            <h2>Kas teater kolibki tulevikus taskutelefoni?</h2>
            <p>
                Vaevalt. Ent see ei tähenda, et me ei võiks täna teatris
                rakendada erinevaid tehnoloogilisi vahendeid. Eriti, kui nende
                abil on võimalik anda publikule lavastuses uusi rolle ja
                võimalusi. Rahvusvahelise teatriprojekti
                <a href="http://www.play-on.eu/">„PlayOn!”</a> raames
                kaardistataksegi teatri ja tehnoloogiate ühisvälja. Nelja aasta
                jooksul saavad projekti partnerid panna end proovile mitme
                erineva ebatavalise võtte või lähtepunktiga.
            </p>

            <p>
                VAT Teatri esmane plaan oli
                <strong>„Vivaariumis”</strong> katsetada
                <strong>motion- ja movement-trackingut</strong>. Koos
                projektipartneri Teatro O Bandoga asusimegi ühisele
                avastusretkele. Motion- ja movement-tracking aitab jälgida nii
                näitlejate kui publiku paiknemist, liikumist ja reaktsioone
                (teatri)ruumis. Tegemist on teatri mõttes äärmiselt põneva
                tehnoloogiaga ja loodetavasti jõuame tulevikus ka selle
                rakendamiseni.
            </p>
            <p>
                „Vivaariumiga” läks aga nõndaviisi, et mida rohkem teste me
                tegime, seda enam oli selge, et antud lavastuse puhul huvitavad
                meid publiku liikumisest rohkem publiku valikud. Seega
                pöördusime arendaja
                <strong>Helena Väinmaa</strong> poole, kes lõi lavastusele
                spetsiaalse ja mitmekülgse veebirakenduse, mille abil saab
                osaleja kulgeda läbi terve Vivaariumi loo.
            </p>

            <p>
                Projekti „PlayOn!” eesmärk on anda publikule teatris aktiivne
                roll ning mõtestada erinevaid ühiskondlikke
                tulevikustsenaariume. Mõlemad elemendid on „Vivaariumis” ka
                esindatud. Nende keskel paikneb aga meie loomingulise tiimi
                jaoks põletav teema –
                <strong>kajakambrid</strong>.
            </p>
            <p>
                Koroona-aastad tõestasid ilmekalt, kuidas oma kodudesse
                eraldunud inimesed jäid üha enam tehismaailma toimemehhanismide
                meelevalda. Veebi korrastavad algoritmid kannavad endas
                iseenesest õilsat eesmärki: nad püüavad tohutu infovälja sees
                leida üles need detailid, mis just sulle huvi võiks pakkuda.
                Selleks loob algoritm aga igast kasutajast
                <strong>profiili</strong>. Pean tõdema, et hämmastusin juba mõne
                aasta eest, kuidas <strong>Youtube</strong> teadis ülima
                täpsusega, mida ma seal parajasti vaadata soovisin. Enda arust
                tulid mul hommikul pähe mõned uitmõtted, ent internetti
                sukeldudes ootasid mind õiged videod juba ees! See oli kui
                võlukunst! Pidin tõdema, et Youtube´i algoritm tunneb mind juba
                paremini kui ma ise.
            </p>

            <p>
                Teisalt, algoritmide varjukülg on, et nad muutuvad minu huvide
                kaardistamises juba liiga osavaks – teemadevalik kahaneb
                päev-päevalt, mull kitseneb, kajakambri seinad muutuvad aina
                läbimatumaks. Ja ühel hetkel leian end üllatuslikult mingis
                äärmuses. Hea, kui minu Youtube´i on vallutanud kassivideod;
                halb aga, kui samasugune radikaliseerumine on toimunud
                maailmavaates. Ja kahjuks on algoritmid suutelised sellekski.
                Rääkimata siis veel meediamajadest, poliitikutest, ühiskondliku
                arvamuse kujundajatest...
            </p>

            <p>
                Öeldaks, et teater võiks olla veel viimane koht, kuhu põgeneda
                ekraanide ja säutsude eest. Öeldakse, et mobiili vahtimise
                vajadus on juba ületanud traditsioonilised sõltuvused.
                <br />
                „Vivaariumis” ei tohtinud sa oma mobiili välja lülitada. Kui
                hääletamine ja virtuaalne ostlemine kõrvale jätta, siis mitu
                korda sa oma mobiili etenduse jooksul vaatasid? Ootamatult vähe?
                Võib-olla on tõesti nii, et kui anda taskutelefonile
                kunstikogemuses konkreetne roll, siis muutub probleem äkki
                hoopis lahenduseks?
            </p>

            <p>Kes teab. Kes teab. Kes teab.</p>

            <p>Mihkel Seeder</p>
        </div>

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
