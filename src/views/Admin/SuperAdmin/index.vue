<script setup>
import router from '../../../router/index';

function openGames() {
    router.push({ name: 'superadmin.games' });
}
function openPhases() {
    router.push({ name: 'superadmin.phases' });
}
</script>
<template>
    <div>
        <h2>Welcome, superadmin.</h2>
        <div class="w-25">
            <button class="m-2 btn btn-outline-secondary" @click="openGames">
                mängud
            </button>
            <button class="m-2 btn btn-outline-secondary" @click="openPhases">
                faasid
            </button>
        </div>
    </div>
    <RouterView :key="$route.fullPath" />
</template>
