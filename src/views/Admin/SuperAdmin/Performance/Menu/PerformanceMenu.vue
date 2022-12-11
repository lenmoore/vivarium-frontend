<script setup>
import { defineProps } from 'vue';
import MenuItem from '../../../../../components/Navigation/MenuItem.vue';

const props = defineProps(['menuItems']);
</script>

<template>
    <div class="performance-menu-wrapper">
        <MenuItem
            v-for="item in menuItems"
            :key="item._id"
            :label="item.title + ' ' + (item.active ? 'AKTIIVNE' : '-')"
            :to="{
                name: 'superadmin.performance-manager.performance',
                params: { id: item._id },
            }"
            class="menu-item"
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
