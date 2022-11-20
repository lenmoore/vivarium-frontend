<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../components/BaseForm/index.vue';
import BaseInput from '../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../../store/performance.store';
import router from '../../../router/index';

console.log(router);
const performanceStore = usePerformanceStore();
performanceStore.getGames();
const games = computed(() => performanceStore.games);

const newGame = {
    name: '',
    pre_capsule: true,
    open_for_colors: ['fuchsia', 'green', 'orange', 'blue'],
};

async function onSubmitGame() {
    const game = await performanceStore.addGame({
        name: newGame.name,
        pre_capsule: newGame.pre_capsule,
        open_for_colors: newGame.open_for_colors,
    });
    await router.push({
        name: 'superadmin.game-details',
        params: { id: game._id },
    });
}
</script>

<template>
    <div>
        <div class="d-flex">
            <div class="w-25 p-4 m-4">
                <div>
                    <div>olemasolevad mangud:</div>

                    <div
                        class="border p-2 m-2"
                        :key="game._id"
                        v-for="game in games"
                        @click="
                            router.push({
                                name: 'superadmin.game-details',
                                params: { id: game._id },
                            })
                        "
                    >
                        {{ game.name }}
                    </div>

                    uus: <br />
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
            </div>
        </div>
    </div>
</template>
