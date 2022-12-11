<template>
    <div class="admin-home container">
        <h2>Tsau, admin.</h2>
        <div v-if="$route.name === 'admin.home'">
            <RouterLink :to="{ name: 'admin.audience' }">Publik</RouterLink>
        </div>
        <RouterView v-else />
    </div>
</template>
