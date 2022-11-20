<script setup>
import { useVisitorStore } from '../../store/visitor.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../store/performance.store';
import { computed, defineEmits, onMounted, watchEffect } from 'vue';
import router from '../../router/index';

const performanceStore = usePerformanceStore();
onMounted(() => {
    performanceStore.getPerformances();
});
const activePerformance = computed(() => {
    return performanceStore.getActivePerformance;
});
const visitorStore = useVisitorStore();

const visitor = {
    email: '',
    wardrobe_number: 0,
    wants_newsletter: false,
    wants_summary: false,
};

async function onLogin() {
    console.log(activePerformance.value);
    visitor.username = visitor.wardrobe_number + '_' + Date.now();
    visitor.wardrobe_number = parseInt(visitor.wardrobe_number);
    if (visitor.email.length === 0) {
        visitor.email = 'n@o.pe';
    }
    console.log(activePerformance);
    visitor.performance = activePerformance.value._id;

    await visitorStore.login(visitor).then((data) => {
        console.log(data);
        localStorage.setItem('accessToken', data.accessToken);
        router.push({ name: 'visitor.intro' });
    });
}
</script>

<template>
    <BaseForm :show-cancel="false" @submit="onLogin">
        <BaseInput
            :id="'wardrobe_number'"
            :label="'Garderoobinumber'"
            :type="'number'"
            name="wardrobe_number"
            v-model="visitor.wardrobe_number"
        />
        <BaseInput
            :id="'email'"
            :label="'Sinu email'"
            :type="'text'"
            name="email"
            v-model="visitor.email"
        />
        <BaseInput
            :id="'newsletter'"
            :label="'Tahan newsletterit'"
            :type="'checkbox'"
            name="newsletter"
            v-model="visitor.wants_newsletter"
        />
    </BaseForm>
</template>
