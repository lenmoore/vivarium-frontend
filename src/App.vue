<template>
    <div class="page">
        <div class="d-flex align-items-start justify-content-between w-100">
            <!--            <span>-->
            <!--                <a v-if="!(isAdmin || isActor)" href="/character">X</a> - - - -->
            <!--                <RouterLink :to="{ path: '/visitor/logout' }"-->
            <!--                    >logout?</RouterLink-->
            <!--                >-->
            <!--            </span>-->
            <a :href="getActiveHomeLink()" class="text-decoration-none"
                ><h1 class="h1-color text-decoration-none">
                    VIVAARIUM
                    <span v-if="!isAdmin && !isActor"
                        >| ID_{{ visitor.wardrobe_number || '?' }}</span
                    >
                </h1>
            </a>

            <a
                v-if="!isActor && !isAdmin"
                :href="getActiveHomeLink()"
                class="text-decoration-none"
                ><h1>
                    <span class="material-symbols-outlined h1-color large-icon">
                        sync
                    </span>
                </h1></a
            >
            <div
                v-else
                class="w-100 d-flex align-items-center justify-content-end"
            >
                <div v-if="timerState.isRunning">
                    {{ timerString }}
                </div>
                <div
                    v-else
                    class="w-100 d-flex align-items-center justify-content-end"
                >
                    <button
                        v-if="!askWhichTimer"
                        class="btn btn-outline-primary"
                        @click="askWhichTimer = true"
                    >
                        Aktiveeri taimer
                    </button>

                    <div v-if="askWhichTimer">
                        <button
                            v-for="timer in timers"
                            :key="timer.minutes + ' _timer'"
                            class="btn btn-outline-primary"
                            @click="startTimer(timer.minutes)"
                        >
                            {{ timer.minutes }}
                        </button>
                    </div>

                    <button
                        v-if="askWhichTimer"
                        class="btn btn-outline-primary"
                        @click="askWhichTimer = false"
                    >
                        Tyhista
                    </button>
                </div>
            </div>
        </div>

        <!--        <a class="font-size-xs" href="https://10.0.0.244:3000/api/games">-->
        <!--            kliki mind kui login lehte pole ja advanced -> proceed-->
        <!--        </a>-->
        <div class="app-wrapper">
            <!--            <a v-if="showLoginBtn" href="/visitor-login"-->
            <!--                ><h1>publik login</h1></a-->
            <!--            >-->
            <div class="app-router-view">
                <RouterView :key="$route.fullPath" />
            </div>
        </div>
        <BaseNavigation ref="nav" class="app-navigation" />
    </div>
</template>

<script lang="ts" setup>
import BaseNavigation from '@/components/Navigation/BaseNavigation.vue';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import router from '@/router';
import { useVisitorStore } from '@/store/visitor.store';
import { usePerformanceStore } from '@/store/performance.store';
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const performanceStore = usePerformanceStore();
const visitorStore = useVisitorStore();
const visitor = reactive(visitorStore.getVisitor);
let showLoginBtn = localStorage.getItem('accessToken') == null;
const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');
let actorState = ref({});
let timers = ref([]);
let activeTimer = ref({});
const phases = ref(computed(() => performanceStore.phases));
let activePhase = ref(phases.value.find((p) => p.active));
let games = ref(computed(() => performanceStore.games));
let activeGame = games.value.find(
    (game) => game?._id === activePhase?.value?.phase_game?._id
);
let askWhichTimer = ref(false);
let timerState = ref({
    countDownDate: 0,
    minutes: 0,
    seconds: 0,
    isRunning: false,
});
let timerString = ref('');
watch(router.currentRoute, async () => {
    showLoginBtn = localStorage.getItem('accessToken') == null;
    await performanceStore.getPhases();
});
onBeforeMount(async () => {
    if (visitor.archived === true) {
        localStorage.clear();
        location.replace('/');
    }
    activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
    const data = await performanceStore.getActorState();

    timers.value = data.timers;
    actorState.value = data;
    let timerActive = timers.value.find((timer) => isInFuture(timer));
    console.log(timerActive);
    if (timerActive) {
        console.log('YAYAYY');
        activeTimer = timerActive;
        console.log('activetimer value', activeTimer.value);
        instance?.proxy?.$forceUpdate();
    }
});

function getActiveHomeLink() {
    const phases = ref(computed(() => performanceStore.phases));
    let activePhase = ref(phases.value.find((p) => p.active));
    let games = ref(computed(() => performanceStore.games));
    activeGame = games.value.find(
        (game) => game?._id === activePhase?.value?.phase_game?._id
    );
    if (isAdmin.value) {
        return '/';
    } else if (isActor.value) {
        return '/admin/audience';
    }

    if (activeGame && activeGame.game_type === 'SHOP') {
        console.log('ou');
        return '/visitor/humanity-shop/basket';
    } else if (activeGame && activeGame.game_type === 'QUIZ') {
        return '/visitor/quiz';
    }
    return '/';
}

function isInFuture(timer: any) {
    console.log(timer);
    if (timer.startTime.length > 0) {
        console.log(timer.startTime.length);
        let countdownDate =
            new Date(timer.startTime).getTime() + timer.minutes * 60000;
        // let countdownDate = new Date('Jan 5, 2024 15:37:25').getTime();
        console.log(new Date(timer.startTime).getTime());
        console.log(countdownDate);
        console.log(new Date().getTime());
        let isInFuture = new Date().getTime() - countdownDate < timer.minutes;
        console.log('isinifuture', isInFuture);
        if (isInFuture) {
            activeTimer.value = timer;
            timerState.value.countDownDate = countdownDate;
            timerState.value.isRunning = true;
        }
        return isInFuture;
    }
}

async function startTimer(minutes: number) {
    console.log(timers);
    let startThisTimer = timers.value.find((t: any) => t.minutes === minutes);
    console.log(startThisTimer);
    if (startThisTimer.startTime.length < 1) {
        console.log('FIUCK');
        startThisTimer.startTime = new Date();
        console.log(timers);
        actorState.value.timers = timers.value;
        console.log(actorState.value);
        await performanceStore.editActorStateSetTimer({
            ...actorState.value,
        });
        location.reload();
    }
}

// timerState.value.countDownDate = new Date('Jan 5, 2024 15:37:25').getTime();

// Update the count down every 1 second
setInterval(() => {
    let timerActive = timers.value.find((timer) => isInFuture(timer));
    if (timerState.value.isRunning) {
        if (timerActive != null) {
            activeTimer = timerActive;
            instance?.proxy?.$forceUpdate();
            timerState.value.isRunning = true;
        }
        console.log('tootab v');
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = timerState.value.countDownDate - now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        timerState.value.minutes = minutes;
        timerState.value.seconds = seconds;

        timerString.value = minutes + ':' + seconds;
        console.log(timerString.value);
        timerState.value.isRunning = true;

        timerState.value.isRunning = true;
        instance?.proxy?.$forceUpdate();

        // If the count down is finished, write some text
        if (distance < 0) {
            timerState.value.isRunning = false;
        }
    }
}, 2000);

setInterval(async function () {
    const data = await performanceStore.getActorState();
    console.log(data);
    timers.value = data.timers;
    actorState.value = data;
}, 100000);
</script>

<style lang="scss">
html,
body,
#app,
.app-wrapper,
.app-router-view {
    height: 97%;
}

.app-wrapper {
    display: block;
    height: available;
}

.app-header {
    padding: 1rem;
}

.app-router-view {
    overflow: scroll;
}

.app-navigation {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-right: auto;
    margin-left: auto;
}

.large-icon {
    font-size: 4rem;
}
</style>
