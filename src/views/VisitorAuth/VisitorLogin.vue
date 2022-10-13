<script setup>
import { useVisitorStore } from '../../store/visitor.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '../../store/performance.store';
import { computed, defineEmits } from 'vue';
import router from '../../router/index';

const performanceStore = usePerformanceStore();
performanceStore.getPerformances();
const activePerformance = computed(
    () => performanceStore.getActivePerformance
).value;
console.log(activePerformance);

const visitor = {
    email: '',
    wardrobe_number: 0,
    wants_newsletter: 'false',
    wants_summary: 'false',
    performance: activePerformance,
};
const emit = defineEmits(['logged-in']);
const visitorStore = useVisitorStore();

async function onLogin() {
    visitor.username =
        visitor.wardrobe_number + '_' + visitor.performance.date.toString();
    visitor.wardrobe_number = parseInt(visitor.wardrobe_number);
    activePerformance.performance_id = activePerformance?.performanceId;
    return await visitorStore.login(visitor).then((data) => {
        console.log(data);
        emit('logged-in');
        router.push({ name: 'visitor.humanity-shop' });
        localStorage.setItem('accessToken', data.accessToken);
    });
}
</script>

<template>
    <BaseForm :show-cancel="false" @submit="onLogin">
        {{ activePerformance }}
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
