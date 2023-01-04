<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { usePerformanceStore } from '../../../../../store/performance.store';
import router from '../../../../../router/index';
import { Step } from '../../../../../types/performances.types';
import GameStep from './GameStep.vue';

const performanceStore = usePerformanceStore();
const id = router.currentRoute.value.params.id;

onBeforeMount(async () => {
    // await performanceStore.getGames();
    // await performanceStore.getPhases();
});

const activePhase = computed(() => performanceStore.getActivePhase);
let game = computed(() => performanceStore.getGame(id));
let newStep = new Step({
    question_text: '',
    question_options: [],
});

async function addStep(val) {
    let gameToSend = game.value;
    let parsedInts = [];
    val.question_options.forEach((opt) => {
        parsedInts.push({
            ...opt,
            humanity_values: {
                red: parseInt(opt.humanity_values.fuchsia || 0),
                fuchsia: parseInt(opt.humanity_values.fuchsia || 0),
                green: parseInt(opt.humanity_values.green || 0),
                blue: parseInt(opt.humanity_values.blue || 0),
                orange: parseInt(opt.humanity_values.orange || 0),
            },
        });
    });
    gameToSend.game_steps.push({ ...val, question_options: parsedInts });
    await performanceStore.editGame(gameToSend);
    window.location.reload();
}

async function editStep(val) {
    game.value.game_steps.push(val);
    await performanceStore.editGame(game.value);
}
</script>
<template>
    <div v-if="game" class="pt-4">
        <h4>{{ game.name }}</h4>
        <small>
            Gruppidele: {{ game.open_for_colors }} | Type:
            {{ game.game_type }} |
            {{ game.pre_capsule ? 'enne kapslisse minekut' : 'kapslis' }}
        </small>

        <div v-if="game.game_type === 'QUIZ'">
            lisa uus:
            <GameStep id="new-step" :step="newStep" @submit="addStep" />

            kysimused, 2ra muuta proovi, see interface on tsipa katki - teen
            millalgi korda:
            <div
                v-for="(step, i) in game.game_steps"
                :id="`step_${i}`"
                :key="`step_${i}`"
            >
                <GameStep :step="step" @submit="editStep" />
            </div>
        </div>
        <div v-else>
            {{ activePhase ? 'aktiivne' : 'ei ole aktiivne' }}

            <div class="mt-4">
                <RouterLink :to="{ name: 'superadmin.games.humanity-shop' }">
                    Vaata tooteid
                </RouterLink>
            </div>
        </div>
    </div>
</template>
