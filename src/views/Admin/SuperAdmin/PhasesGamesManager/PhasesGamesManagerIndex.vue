<script></script>

<template>
    <div>
        <h3>Seadistus</h3>

        <div>Igal etendusel on samad mängud ja samad faasid.</div>
        <div>
            Helena tegi juba praeguse briifi jargi koik mangud ara, aga void
            vaadata ikka, mis siin toimub. Ara ainult muutma hakka asju, eks.
        </div>
        <RouterLink :to="{ name: 'superadmin.games' }" class="m-1"
            >m2ngud
        </RouterLink>
        <RouterLink :to="{ name: 'superadmin.phases' }" class="m-1"
            >faasid
        </RouterLink>
        <RouterView :key="$route.fullPath" />
    </div>
</template>
