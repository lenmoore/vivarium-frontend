<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { usePerformanceStore } from '@/store/performance.store';
import router from '@/router';
import { LocationQueryRaw } from 'vue-router';
import moment from 'moment';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');
const hasAccessToken = ref(localStorage.getItem('accessToken') != null);
onBeforeMount(async () => {
    await performanceStore.getPhases();

    if (isActor.value || isAdmin.value || hasAccessToken) {
        await performanceStore.getGames();
        await performanceStore.getPerformances();
        renderLinks();
    }
});

let confirmedHumanityValue = localStorage.getItem('confirmed_humanity_value');
watch(router.currentRoute, () => {
    console.log('route change');
    renderLinks();
});
// links
const home = { name: 'home', label: 'mina', query: {} };
const basket = {
    name: 'visitor.humanity-shop.basket',
    label: 'Korv',
    query: {},
};
const scan = { name: 'visitor.humanity-shop.scan', label: 'Pood', query: {} };
const quiz = { name: 'visitor.quiz', label: 'küsitlus', query: {} };
let navLinks = ref({ linx: [home] });

const isAuthenticated = ref(localStorage.getItem('accessToken') != null);

function renderLinks() {
    // stuff from store
    const phases = ref(computed(() => performanceStore.phases));
    const activePhase = ref(phases.value.find((p) => p.active));
    const games = ref(computed(() => performanceStore.games));
    const activeGame = ref(
        games.value.find(
            (game) => game?._id === activePhase?.value?.phase_game?._id
        )
    );
    console.log(activeGame.value?.game_type);
    if (isAuthenticated.value && isAdmin.value) {
        navLinks.value.linx = [
            { name: 'admin.audience.overview', label: 'kapslid', query: {} },
            { name: 'superadmin.games', label: 'mangud', query: {} },
            { name: 'superadmin.phases', label: 'faasid', query: {} },
            {
                name: 'superadmin.games.humanity-shop.products',
                label: 'tooted',
                query: {},
            },
            {
                name: 'superadmin.performances',
                label: 'etendused',
                query: {},
            },
        ];
    } else if (isAuthenticated.value && isActor.value) {
        navLinks.value.linx = [
            { name: 'admin.audience.overview', label: 'kapslid', query: {} },
            // { name: 'superadmin.phases', label: 'faasid', query: {} },
        ];
    } else if (isAuthenticated.value && !isActor.value && !isAdmin.value) {
        navLinks.value.linx = [];
        // is authenticated as visitor

        if (activeGame.value && activeGame.value.game_type === 'SHOP') {
            navLinks.value.linx.push(basket);
            navLinks.value.linx.push(scan);
        } else if (activeGame.value && activeGame.value.game_type === 'QUIZ') {
            navLinks.value.linx.push(quiz);
        }
    } else {
        navLinks.value.linx = [];
    }
}

let adminMenuOpen = ref(false);

function toggleAdminMenu() {
    adminMenuOpen.value = !adminMenuOpen.value;
}

// todo fix this stupid hack
async function goTo(link: {
    name: string;
    query: LocationQueryRaw;
    label: string;
}) {
    await router.push({ name: link.name, query: link.query });
    adminMenuOpen.value = false;
    // if (
    //     router.currentRoute.value.name
    //         ?.toString()
    //         .split('.')
    //         .includes(link.name.split('.')[0])
    // ) {
    //     console.log('te');
    //     location.replace(router.currentRoute.value.fullPath);
    //     // renderLinks();
    // } else {
    //     await router.push('/');
    // }
}

// todo timer has to be synced for everyone
let timer = ref({
    timerGoing: false,
    timerStartedAt: new Date().getTime(),
    timerMinutes: 0,
    showTimerConfirm: false,
});

let timerString = ref('');

function askStartTimer(time: number) {
    console.log(time);
    timer.value.timerMinutes = time;
    timer.value.showTimerConfirm = true;
}

function dontStart() {
    timer.value.timerMinutes = 0;
    timer.value.showTimerConfirm = false;
}

function startTimer() {
    timer.value.timerStartedAt = new Date().getTime();
    timer.value.timerGoing = true;
    timer.value.showTimerConfirm = false;

    // Set the date we're counting down to
    let minutes = timer.value.timerMinutes + new Date().getMinutes();
    var countDownDate = new Date().setMinutes(minutes);

    // Update the count down every 1 second
    var x = setInterval(function () {
        // Get today's date and time

        // Find the distance between now and the count down date
        var distance = countDownDate - new Date().getTime();

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        timerString.value = minutes + 'm:' + seconds + 's ';

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            timerString.value = ' AEG LABI ';
        }
    }, 1000);
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    location.replace('/');
}
</script>

<template>
    <div v-if="isAdmin && !adminMenuOpen">
        <button class="btn" @click="toggleAdminMenu">menu</button>
    </div>
    <!--    <button class="btn" @click="logout">logout</button>-->

    <button
        v-if="isAuthenticated && $route.path === '/visitor/logout'"
        class="btn btn-primary"
        @click="logout"
    >
        logout
    </button>
    <div
        v-if="confirmedHumanityValue !== 'none'"
        :class="
            {
                turq: 'bg-orange',
                fuchsia: 'bg-fuchsia',
                silver: 'bg-blue',
                lime: 'bg-green',
                none: '',
            }[confirmedHumanityValue]
        "
        class="p-1 w-100 text-center"
    >
        {{
            {
                turq: 'Türkiis',
                fuchsia: 'Violett',
                silver: 'Hõbevalge',
                lime: 'Laim',
            }[confirmedHumanityValue]
        }}
    </div>
    <nav v-if="isAdmin && adminMenuOpen" class="container nav-wrapper">
        <button class="btn" @click="toggleAdminMenu">sulge</button>
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
        </span>
        <button class="btn" @click="logout">logout</button>
    </nav>
    <nav v-else-if="isAuthenticated && isActor">
        <!--        <div v-if="timer.showTimerConfirm">-->
        <!--            Kindel, et alustad taimerit?-->
        <!--            <button class="btn btn-primary" @click="startTimer">Jah</button>-->
        <!--            <button class="btn btn-outline-primary" @click="dontStart">-->
        <!--                Tühista-->
        <!--            </button>-->
        <!--        </div>-->
        <!--        <div v-else-if="timer.timerGoing">-->
        <!--            <h3>{{ timerString }}</h3>-->
        <!--        </div>-->
        <!--        <div v-else class="timers">-->
        <!--            <button @click="askStartTimer(7)">7min taimer</button>-->
        <!--            <button @click="askStartTimer(9)">9min taimer</button>-->
        <!--            <button @click="askStartTimer(10)">10min taimer</button>-->
        <!--        </div>-->

        <!--        <span-->
        <!--            v-for="(link, i) in navLinks.linx"-->
        <!--            :key="`${navLinks.linx.length}_${i}`"-->
        <!--        >-->
        <!--            <button class="nav-item" @click="goTo(link)">-->
        <!--                {{ link.label }}-->
        <!--            </button>-->
        <!--        </span>-->
        <!--        <button class="btn" @click="logout">logout</button>-->
    </nav>
    <nav v-else-if="isAuthenticated.value && !isActor.value && !isAdmin.value">
        <span
            v-for="(link, i) in navLinks.linx"
            :key="`${navLinks.linx.length}_${i}`"
        >
            <button class="nav-item" @click="goTo(link)">
                {{ link.label }}
            </button>
        </span>
    </nav>
    <!--    <button class="btn" @click="renderLinks">XX</button>-->
</template>

<style lang="scss">
@import 'src/assets/common';

.nav-wrapper {
    overflow: scroll;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $bg-color;
    margin-left: 1rem;
    margin-right: 1rem;
    padding: 0.5rem;
    height: 100%;
    bottom: 0;
}

.nav-item {
    text-decoration: none;
    background-color: white;
    color: black;
    margin: 0.5rem;
    text-align: center;

    padding: 0.2rem 0.5rem;
    border: $dark-blue solid 1px;
    display: flex;
    justify-content: center;
    //box-shadow: 1px 1px 20px #ffffff;
}
</style>
