<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../components/BaseForm/index.vue';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';
import { Game } from '../../../types/performances.types';

console.log(router);
const performanceStore = usePerformanceStore();
performanceStore.getGames();
const games = computed(() => performanceStore.games);

const newPhase = {
    name: '',
    active: false,
    game: Game,
};

async function onSubmitPhase() {
    console.log(newPhase);
    return await performanceStore.addPhase({
        name: newPhase.name,
        active: newPhase.active,
        phase_game: newPhase.game,
    });
}
</script>

<template>
    <div>
        <div class="d-flex">
            <div class="w-25 p-4 m-4">
                <div>
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
