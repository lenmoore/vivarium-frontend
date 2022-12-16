<template>
    <div class="hello">
        <h1>{{ healthCheckResult }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeMount, reactive } from 'vue';
import { useMainStore } from '../store';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();

const { healthCheckResult } = storeToRefs(mainStore);

mainStore.healthCheck();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
