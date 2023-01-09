<script setup>
import { computed, reactive } from 'vue';
import BaseForm from '../../../../../components/BaseForm/index.vue';
import BaseInput from '../../../../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '@/store/performance.store';
import router from '../../../../../router/index';

console.log(router);
const performanceStore = usePerformanceStore();
performanceStore.getGames();
const games = computed(() => performanceStore.games);

const newGame = {
    name: '',
    pre_capsule: true,
    open_for_colors: 'fuchsia,lime,silver,turq',
    type: 'QUIZ',
};

async function onSubmitGame() {
    console.log(newGame);
    const game = await performanceStore.addGame({
        name: newGame.name,
        game_type: newGame.type,
        pre_capsule: newGame.pre_capsule,
        open_for_colors: newGame.open_for_colors,
    });
    console.log(game);
    await router.push({
        name: 'superadmin.games.game-details',
        params: { id: game._id },
    });
}
</script>

<template>
    <div>
        <div class="d-flex w-100 flex-column">
            <div>
                <div
                    v-if="router.currentRoute.value.name === 'superadmin.games'"
                    class="p-2"
                >
                    <h4>olemasolevad mangud:</h4>

                    <div
                        v-for="game in games"
                        :key="game._id"
                        class="border p-2 mb-1 hover"
                        @click="
                            router.push({
                                name: 'superadmin.games.game-details',
                                params: { id: game._id },
                            })
                        "
                    >
                        {{ game.name }}
                        <span
                            v-for="color in game.open_for_colors"
                            :key="color + '_' + game.name"
                            :class="color + ' ' + 'bg-' + color"
                            class="color-badge"
                        >
                            __
                        </span>
                    </div>

                    <h4 class="mt-4">Lisa uus:</h4>
                    <BaseForm class="border p-2 w-100" @submit="onSubmitGame">
                        <BaseInput
                            id="name"
                            v-model="newGame.name"
                            label="game nimi"
                            name="game_name"
                            type="text"
                        />

                        <BaseInput
                            id="for_colors"
                            v-model="newGame.open_for_colors"
                            class="mb-4"
                            label="vali varvid"
                        />

                        <BaseInput
                            v-model="newGame.pre_capsule"
                            label="Enne kapslisse minekut"
                            type="checkbox"
                        />
                    </BaseForm>
                </div>

                <RouterView v-else :key="router.currentRoute.value.fullPath" />
            </div>
        </div>
    </div>
</template>
