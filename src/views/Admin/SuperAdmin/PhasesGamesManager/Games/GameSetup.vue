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
                fuchsia: parseInt(opt.humanity_values?.fuchsia || 0),
                lime: parseInt(opt.humanity_values?.lime || 0),
                silver: parseInt(opt.humanity_values?.silver || 0),
                turq: parseInt(opt.humanity_values?.turq || 0),
            },
        });
    });
    gameToSend.game_steps.push({ ...val, question_options: parsedInts });
    await performanceStore.editGame(gameToSend);
    window.location.reload();
}

async function editOrAddStep(val) {
    let gameToSend = game.value;
    if (val._id) {
        let parsedInts = [];
        val.question_options.forEach((opt) => {
            parsedInts.push({
                ...opt,
                humanity_values: {
                    fuchsia: parseInt(opt.humanity_values?.fuchsia || 0),
                    lime: parseInt(opt.humanity_values?.lime || 0),
                    silver: parseInt(opt.humanity_values?.silver || 0),
                    turq: parseInt(opt.humanity_values?.turq || 0),
                },
            });
        });
        console.log(gameToSend.game_steps);
        let stepToUpdate = gameToSend.game_steps.find(
            (gs) => gs._id === val._id
        );
        stepToUpdate.question_options = {
            ...val,
            question_options: parsedInts,
        };
        console.log(stepToUpdate);
        console.log(val);
        console.log(gameToSend);

        await performanceStore.editGame(gameToSend);
    } else {
        await addStep(val);
    }
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
            <br />
            Lisa uus:
            <GameStep id="new-step" :step="newStep" @submit="addStep" />

            Olemas {{ game.game_steps.length }}: <br />
            <div
                v-for="(step, i) in game.game_steps"
                :id="`step_${i}`"
                :key="`step_${i}`"
            >
                <GameStep :step="step" @submit="editOrAddStep" />
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
