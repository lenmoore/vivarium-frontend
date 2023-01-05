<script setup>
import router from '../../../router/index';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useHumanityShopStore } from '../../../store/humanity-shop/humanity-shop.store';
import ProductItem from '../../HumanityShop/Admin/ProductItem.vue';
import { useRoute } from 'vue-router';
import { usePerformanceStore } from '../../../store/performance.store';

const route = useRoute();
const performanceStore = usePerformanceStore();
const id = router.currentRoute.value.params.id;

const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');
let games = computed(() => performanceStore.games);

const humanityStore = useHumanityShopStore();
let showOnlyColor = '';
console.log(showOnlyColor);
await humanityStore.fetchProducts();

let sortedProducts = reactive([]);
let isLoading = ref(false);
onBeforeMount(async () => {
    isLoading = true;
    let products = computed(() => humanityStore.products).value;
    showOnlyColor = ref(localStorage.getItem('actor_color'));
    let color = {
        turq: 'orange',
        fuchsia: 'fuchsia',
        silver: 'blue',
        lime: 'green',
    }[showOnlyColor.value];
    console.log(color);
    sortedProducts = products.sort(
        (a, b) =>
            b.humanity_values[color]?.average -
            a.humanity_values[color]?.average
    );

    console.log('omfg');

    console.log(sortedProducts);
    isLoading = false;
});

async function sortGames() {
    // await performanceStore.getGames();
    games = computed(() => performanceStore.games);
    let color = {
        turq: 'orange',
        fuchsia: 'fuchsia',
        silver: 'blue',
        lime: 'green',
    }[showOnlyColor.value];
    console.log(games);
    return games.value.filter((g) => g.open_for_colors.includes(color));
}

function isForSelectedColor(color) {
    return (
        color ===
        {
            turq: 'orange',
            fuchsia: 'fuchsia',
            silver: 'blue',
            lime: 'green',
        }[showOnlyColor.value]
    );
}
</script>

<template>
    <div class="my-4">
        <div v-if="isAdmin">
            <button
                :class="{ 'font-size-xl': showOnlyColor === 'turq' }"
                class="mx-2 p-2"
                style="background-color: paleturquoise"
                @click="
                    showOnlyColor = 'turq';
                    games = sortGames();
                "
            >
                Türkiis
            </button>

            <button
                :class="{ 'font-size-xl': showOnlyColor === 'fuchsia' }"
                class="mx-2 p-2"
                style="background-color: lightpink"
                @click="
                    showOnlyColor = 'fuchsia';
                    games = sortGames();
                "
            >
                Violett
            </button>

            <button
                :class="{ 'font-size-xl': showOnlyColor === 'silver' }"
                class="mx-2 p-2"
                style="background-color: silver"
                @click="
                    showOnlyColor = 'silver';
                    games = sortGames();
                "
            >
                Hõbevalge
            </button>

            <button
                :class="{ 'font-size-xl': showOnlyColor === 'lime' }"
                class="mx-2 p-2"
                style="background-color: lime"
                @click="
                    showOnlyColor = 'lime';
                    games = sortGames();
                "
            >
                Laim
            </button>
        </div>
        <br /><br />
        <div>
            <div class="py-4 col">
                <h2>Mäng kapslis</h2>
                <div>
                    <div v-for="(game, i) in games" :key="game._id + i">
                        <div
                            v-if="
                                game.game_type !== 'SHOP' &&
                                isForSelectedColor(game.open_for_colors[0])
                            "
                        >
                            <h3>{{ game.name }}</h3>

                            <div
                                v-for="step in game.game_steps"
                                :key="step._id"
                                class="py-2"
                            >
                                <strong>{{ step.question_text }}</strong>
                                <div
                                    v-for="option in step.question_options"
                                    :key="option.option_text"
                                >
                                    {{ option.option_text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="py-4 col">
                <h2>Kapsli toodete edetabel</h2>
                <div v-if="isLoading">...</div>
                <div v-else class="products">
                    <div
                        v-for="(product, i) in sortedProducts"
                        :key="product._id + i"
                        class="product"
                    >
                        <div>
                            {{ product.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
