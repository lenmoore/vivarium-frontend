<script setup>
import VisitorLogin from '../VisitorAuth/VisitorLogin.vue';

import { useVisitorStore } from '../../store/visitor.store';

const visitorStore = useVisitorStore();
const visitor = visitorStore.getVisitor;

function onLogin() {
    visitor.isLoggedIn = true;
}
</script>
<template>
    Hello visitor.
    <VisitorLogin @logged-in="onLogin" v-if="!visitor.isLoggedIn" />
    <RouterView v-else />
</template>
