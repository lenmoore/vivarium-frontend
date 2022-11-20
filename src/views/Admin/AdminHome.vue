<template>
    <div class="admin-home">
        <h1>Admin</h1>
        <div v-if="$route.name === 'admin.home'">
            <div>Vaata ringi homie.</div>
            <RouterLink :to="{ name: 'admin.audience' }">Publik</RouterLink>
        </div>
        <RouterView v-else />
    </div>
</template>
