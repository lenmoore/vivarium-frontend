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
            <ul>
                <li><button @click="openGames">showGames</button></li>
                <li><button @click="openPhases">phases</button></li>
            </ul>
        </div>
    </div>
    <RouterView />
</template>
