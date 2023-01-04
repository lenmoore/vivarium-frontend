<script setup>
import router from '../../../router/index';

let isInSuperadminIndex = router.currentRoute.value.name === 'superadmin';
</script>
<template>
    <!--    <div class="container">-->
    <!--        <div class="d-flex w-25">-->
    <!--            <RouterLink-->
    <!--                :to="{ name: 'superadmin.settings' }"-->
    <!--                class="btn btn-outline-primary m-1"-->
    <!--            >-->
    <!--                Seaded-->
    <!--            </RouterLink>-->
    <!--            <RouterLink-->
    <!--                :to="{ name: 'superadmin.performances' }"-->
    <!--                class="btn btn-outline-primary m-1"-->
    <!--            >-->
    <!--                Etendused-->
    <!--            </RouterLink>-->
    <!--        </div>-->
    <!--    </div>-->
    <RouterView :key="$route.fullPath" class="container" />
</template>
