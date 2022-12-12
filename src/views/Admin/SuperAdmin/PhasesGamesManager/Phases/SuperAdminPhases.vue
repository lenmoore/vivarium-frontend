<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../../../components/BaseForm/index.vue';
import BaseInput from '../../../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../../../store/performance.store';
import { Game } from '../../../../../types/performances.types';

const performanceStore = usePerformanceStore();
performanceStore.getGames();
performanceStore.getPhases();
const games = computed(() => performanceStore.games);
const phases = computed(() => performanceStore.phases);

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
            <div class="p-4 m-4">
                <div>
                    <div>phases.</div>

                    Lisa uus siit> <br />
                    <small
                        >TODO kui lisad, siis vajuta ainult 1x, see parempoolne
                        list ei update ja mingit tagasisidet ei tule, aga faas
                        luuakse
                    </small>
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
            <div>
                olemas faasid:
                <div v-for="phase in phases" :key="phase._id">
                    <strong>{{ phase.name }}</strong>
                    <small>
                        | aktiivne: {{ phase.active }} | mäng ={{
                            phase.phase_game.name
                        }}</small
                    >
                </div>
            </div>
        </div>
    </div>
</template>
