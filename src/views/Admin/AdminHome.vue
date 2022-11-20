<template>
    <div class="admin-home">
        <h1>Admin</h1>
        <div v-if="$route.name === 'admin.home'">
            <div>Vaata ringi homie</div>
        </div>
        <RouterView v-else />
    </div>
</template>
