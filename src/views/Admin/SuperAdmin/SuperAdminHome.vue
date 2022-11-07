<script setup>
import { reactive } from 'vue';
import BaseForm from '../../../components/BaseForm/index.vue';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../store/performance.store';
const performanceStore = usePerformanceStore();

let games = reactive({ state: false });
let phases = reactive({ state: false });

const newGame = {
    name: '',
    pre_capsule: true,
    open_for_colors: [''],
};

const newPhase = {
    name: '',
    active: false,
};

async function onSubmitPhase() {
    return await performanceStore.addPhase({
        name: newPhase.name,
        active: newPhase.active,
    });
}

function openGames() {
    games.state = !games.state;
}
function openPhases() {
    phases.state = !phases.state;
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
                    <li><button @click="openGames">games</button></li>
                    <li><button @click="openPhases">phases</button></li>
                </ul>
            </div>

            <div class="w-75">
                <div v-if="games.state">
                    <div>games.</div>

                    <div></div>
                </div>

                <div v-else-if="phases">
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
                    </BaseForm>
                </div>
            </div>
        </div>
    </div>
</template>
