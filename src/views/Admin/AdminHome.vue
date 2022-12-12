<template>
    <div class="admin-home container">
        <h2>Tsau, admin.</h2>
        <div v-if="$route.name === 'admin.home'" class="d-flex flex-column">
            <RouterLink :to="{ name: 'admin.audience' }">
                Publik koik
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'blue-sky' } }"
            >
                Publik blue-sky
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'fuchsia' } }"
            >
                Publik fuchsia
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'silver' } }"
            >
                Publik silver
            </RouterLink>
            <RouterLink
                :to="{ name: 'admin.audience', query: { color: 'lime' } }"
            >
                Publik lime
            </RouterLink>
        </div>
        <RouterView v-else />
    </div>
</template>
