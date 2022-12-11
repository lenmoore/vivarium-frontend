<script setup>
import router from '../../../router/index';

let isInSuperadminIndex = router.currentRoute.value.name === 'superadmin';
</script>
<template>
    <div class="container">
        <h2>Tsau, superadmin.</h2>
        <div v-if="isInSuperadminIndex" class="d-flex w-25">
            <RouterLink
                :to="{ name: 'superadmin.settings' }"
                class="btn btn-outline-primary m-1"
            >
                Seaded
            </RouterLink>
            <RouterLink
                :to="{ name: 'superadmin.performances' }"
                class="btn btn-outline-primary m-1"
            >
                Etendused
            </RouterLink>
        </div>
        <div v-else class="pb-4">
            <RouterLink
                :to="{ name: 'superadmin' }"
                class="btn btn-outline-primary m-1"
            >
                {{ '<   ' }} Tagasi
            </RouterLink>
        </div>
    </div>
    <RouterView :key="$route.fullPath" class="container" />
</template>
