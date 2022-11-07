<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../components/BaseForm/index.vue';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../store/performance.store';
const performanceStore = usePerformanceStore();
performanceStore.getGames();
const games = computed(() => performanceStore.games);

let showGames = reactive({ state: false });
let showPhases = reactive({ state: false });

const newGame = {
    name: '',
    pre_capsule: true,
    open_for_colors: ['red', 'green', 'orange', 'blue'],
};

const newPhase = {
    name: '',
    active: false,
    game: '',
};

async function onSubmitGame() {
    return await performanceStore.addGame({
        name: newGame.name,
        pre_capsule: newGame.pre_capsule,
        open_for_colors: newGame.open_for_colors,
    });
}
async function onSubmitPhase() {
    return await performanceStore.addPhase({
        name: newPhase.name,
        active: newPhase.active,
        game: newPhase.game,
    });
}

function openshowGames() {
    showGames.state = true;
    showPhases.state = false;
}
function openPhases() {
    showPhases.state = true;
    showGames.state = false;
}
</script>

<template>
    <div>
        <div>
            <h2>Welcome, superadmin.</h2>
        </div>

        <div class="d-flex">
            <div class="w-25">
                <ul>
                    <li><button @click="openshowGames">showGames</button></li>
                    <li><button @click="openPhases">phases</button></li>
                </ul>
            </div>

            <div class="w-75">
                <div v-if="showGames.state">
                    <div>showGames.</div>

                    add new: <br />
                    <BaseForm @submit="onSubmitGame">
                        <BaseInput
                            id="name"
                            label="game nimi"
                            name="game_name"
                            type="text"
                            v-model="newGame.name"
                        />
                    </BaseForm>
                </div>

                <div v-else-if="showPhases">
                    <div>phases.</div>

                    add new: <br />
                    <BaseForm @submit="onSubmitPhase">
                        <BaseInput
                            id="name"
                            label="faasi nimi"
                            name="phase_name"
                            type="text"
                            v-model="newPhase.name"
                        />
                        <BaseInput
                            id="name"
                            label="faas"
                            name="game_phase"
                            type="select"
                            :options="games"
                            v-model="newPhase.game"
                        />
                    </BaseForm>
                </div>
            </div>
        </div>
    </div>
</template>
