<script setup>
import VisitorLogin from '../VisitorAuth/VisitorLogin.vue';

import { useVisitorStore } from '../../store/visitor.store';

const visitorStore = useVisitorStore();
const visitor = visitorStore.getVisitor;
</script>
<template>
    Hello visitor.
    <VisitorLogin v-if="!visitor.isLoggedIn" />
    <RouterView v-else />
</template>
