<script setup>
import { useVisitorStore } from '@/store/visitor.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '@/store/performance.store';
import { computed, defineEmits, onBeforeMount, watchEffect } from 'vue';
import router from '../../router/index';
import moment from 'moment';

const performanceStore = usePerformanceStore();
onBeforeMount(async () => {
    await performanceStore.getPerformances();
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
        visitor.email = moment();
    }
    console.log(activePerformance.value);
    visitor.performance = activePerformance.value._id;

    const localVisitor = await visitorStore.login(visitor).data;
    localStorage.setItem('visitorId', localVisitor.visitorId);
    localStorage.setItem('visitor', visitor);
    router.push({ name: 'visitor.intro' });
}
</script>

<template>
    <h1 class="container">Sisene Vivaariumisse</h1>
    <BaseForm
        v-if="activePerformance"
        :show-cancel="false"
        :submit-label="'Sisene'"
        class="container"
        @submit="onLogin"
    >
        <BaseInput
            :id="'wardrobe_number'"
            v-model="visitor.wardrobe_number"
            :label="'Sinu garderoobinumber *'"
            :type="'number'"
            name="wardrobe_number"
        />
        <BaseInput
            :id="'email'"
            v-model="visitor.email"
            :label="'Email, kui soovid VAT teatri uudiskirja'"
            :placeholder="'Email'"
            :type="'email'"
            disabled
            name="email"
        />
    </BaseForm>
    <div v-else class="container">! Etendus algab 18:45.</div>
</template>
