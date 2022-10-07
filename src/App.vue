<template>
    <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/about">About</RouterLink> |
        <RouterLink to="/login">Login</RouterLink> |
        <RouterLink to="/humanity-shop">Humanity Shop</RouterLink> |
    </nav>
    <RouterView />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const res = '';
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
