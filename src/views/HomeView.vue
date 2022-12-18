<template>
    <div class="container">
        <VisitorLogin v-if="showLoginView" />
        <HumanityShopHome v-else />
    </div>
</template>
<script>
import VisitorLogin from '@/views/VisitorAuth/VisitorLogin.vue';
import HumanityShopHome from '@/views/HumanityShop/HumanityShopHome.vue';

export default {
    components: { HumanityShopHome, VisitorLogin },
    computed: {
        showLoginView() {
            return localStorage.getItem('accessToken') == null;
        },
    },
};
</script>
