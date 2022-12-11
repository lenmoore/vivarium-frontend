<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../../../components/BaseForm/index.vue';
import BaseInput from '../../../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../../../store/performance.store';
import { Game } from '../../../../../types/performances.types';

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
                            v-model="newPhase.name"
                            label="faasi nimi"
                            name="phase_name"
                            type="text"
                        />
                        <BaseInput
                            id="name"
                            v-model="newPhase.game"
                            :options="games"
                            label="mäng faasi ajal"
                            name="phase_game"
                            type="select"
                        />
                    </BaseForm>
                </div>
            </div>
        </div>
    </div>
</template>
