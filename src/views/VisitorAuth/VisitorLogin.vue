<script setup>
import { useVisitorStore } from '@/store/visitor.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import { usePerformanceStore } from '@/store/performance.store';
import { computed, onBeforeMount, reactive } from 'vue';
import moment from 'moment';

import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
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
    wardrobe_number: null,
    wants_newsletter: false,
    wants_summary: false,
};

let isLoading = reactive(false);

async function onLogin() {
    isLoading = true;
    console.log(isLoading);
    instance?.proxy?.$forceUpdate();
    if (visitor.wardrobe_number > 0) {
        visitor.username = visitor.wardrobe_number + '_' + Date.now();
        visitor.wardrobe_number = parseInt(visitor.wardrobe_number);
        if (visitor.email.length === 0) {
            visitor.email = moment();
        }
        visitor.performance = activePerformance.value._id;

        await visitorStore.login(visitor).data;
    } else {
        alert('Kas sisestasid õige garderoobinumbri?');
    }
    isLoading = false;
}
</script>

<template>
    <div>
        <h1 class="text-center">Vivaariumi eksperiment on lõppenud.</h1>
        <br /><br /><br />
        <div
            class="d-flex flex-column flex-sm-row align-items-center justify-content-around"
        >
            <a class="btn btn-primary p-4 m-1" href="/arhiiv">Mine arhiivi</a>
            <a class="btn btn-primary p-4 m-1" href="/kava">Loe kavalehte</a>
        </div>
    </div>
</template>
