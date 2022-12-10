<script setup>
import router from '../../../router/index';

function startNextGame() {
    router.push({ name: 'visitor.quiz' });
}
</script>
<template>
    Oled valmis. Mine jargmisesse ruumi. Vota istet ja oota sobrad ara. Kui oled
    seal, vajuta nuppu.
    <button @click="startNextGame()">nupp</button>
</template>
