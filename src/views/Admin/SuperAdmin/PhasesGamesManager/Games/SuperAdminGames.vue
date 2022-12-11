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
    open_for_colors: 'fuchsia,green,orange,blue',
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
                    class="w-25 p-4 m-4"
                >
                    <div>olemasolevad mangud:</div>

                    <div
                        v-for="game in games"
                        :key="game._id"
                        class="border p-2 m-2"
                        @click="
                            router.push({
                                name: 'superadmin.games.game-details',
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
                            v-model="newGame.name"
                            label="game nimi"
                            name="game_name"
                            type="text"
                        />

                        <BaseInput
                            id="for_colors"
                            v-model="newGame.open_for_colors"
                            label=">>(lime=green,fuchsia=fuchsia,blue=orange,silver=blue!!)"
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
