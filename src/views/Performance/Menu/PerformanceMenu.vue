<script setup>
import { defineProps } from 'vue';
import MenuItem from '../../../components/Navigation/MenuItem.vue';
const props = defineProps(['menuItems']);
</script>

<template>
    <div class="performance-menu-wrapper">
        <MenuItem
            class="menu-item"
            :key="item._id"
            v-for="item in menuItems"
            :to="{
                name: 'admin.performance-manager.performance',
                params: { id: item._id },
            }"
            :label="item.title"
        />
    </div>
</template>
<style lang="scss">
.performance-menu-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    margin-bottom: 2rem;
}
</style>
