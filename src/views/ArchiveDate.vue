<script setup>
import { onMounted, reactive, ref } from 'vue';
import router from '../router/index';

import { getCurrentInstance } from 'vue';
import { useVisitorStore } from '../store/visitor.store';

const instance = getCurrentInstance();
const visitorStore = useVisitorStore();
let visitors = ref([]);
let sortedVisitors = ref([]);
const date = router.currentRoute.value.params.date;

onMounted(async () => {
    console.log(router.currentRoute);
    console.log(date);
    visitors = await visitorStore.fetchVisitorsByDate(date);
    sortedVisitors = visitors?.value?.sort(
        (a, b) => b.wardrobe_number - a.wardrobe_number
    );
    instance?.proxy?.$forceUpdate();
});
</script>
<template>
    <div>
        Kuupaeval {{ date }} olid saalis jargnevate garderoobinumbritega
        inimesed:

        <div>
            <RouterLink
                v-for="visitor in visitors"
                :key="visitor"
                :class="'bg-' + visitor.confirmed_humanity_value"
                :to="{
                    name: 'character',
                    params: {
                        date: date,
                        wardrobe: visitor.wardrobe_number,
                    },
                }"
                class="btn btn-outline-primary m-2 font-size-xl"
            >
                {{ visitor.wardrobe_number }} <br />
            </RouterLink>
            <br />
        </div>
    </div>
</template>

<style>
.bg-fuchsia {
    color: white;
}

.bg-turq {
    background-color: turquoise;
}

.bg-silver {
    background-color: silver;
}

.bg-lime {
    background-color: limegreen;
    color: white;
}
</style>
