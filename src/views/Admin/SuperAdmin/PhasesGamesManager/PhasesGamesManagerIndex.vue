<script></script>

<template>
    <div>
        <!--        <div v-if="$route.name === 'superadmin.settings'">-->
        <!--            <RouterLink :to="{ name: 'superadmin.games' }" class="pr-2 mr-2"-->
        <!--                >Mängud->-->
        <!--            </RouterLink>-->
        <!--            <br />-->
        <!--            <RouterLink :to="{ name: 'superadmin.phases' }"-->
        <!--                >Faasid->-->
        <!--            </RouterLink>-->
        <!--        </div>-->
        <RouterView :key="$route.fullPath" />
    </div>
</template>
