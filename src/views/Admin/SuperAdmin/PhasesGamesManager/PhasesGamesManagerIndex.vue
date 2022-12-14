<script></script>

<template>
    <div>
        <div class="d-flex align-items-center">
            <RouterLink
                v-if="$route.name !== 'superadmin.settings'"
                :to="{ name: 'superadmin.settings' }"
                class="btn btn-outline-primary m-1 pr-4"
            >
                {{ '<   ' }} Seaded
            </RouterLink>
            <h4 class="mb-0">Etenduse käik</h4>
        </div>

        <div>Igal etendusel on samad mängud ja samad faasid.</div>
        <div>
            Helena tegi juba praeguse briifi järgi kõik mängud ära. Ära midagi
            muuta ürita praegu.
        </div>
        <div v-if="$route.name === 'superadmin.settings'">
            <RouterLink :to="{ name: 'superadmin.games' }" class="pr-2 mr-2"
                >Mängud->
            </RouterLink>
            <br />
            <RouterLink :to="{ name: 'superadmin.phases' }"
                >Faasid->
            </RouterLink>
        </div>
        <RouterView :key="$route.fullPath" />
    </div>
</template>
