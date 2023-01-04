<script setup>
import { ref } from 'vue';
import VisitorLogin from '@/views/VisitorAuth/VisitorLogin.vue';
import HumanityShopHome from '@/views/HumanityShop/HumanityShopHome.vue';

const showLoginView = ref(localStorage.getItem('accessToken') == null);
</script>
<template>
    <div class="container">
        <VisitorLogin v-if="showLoginView" />
        <HumanityShopHome v-else />
    </div>
</template>
