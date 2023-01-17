<template>
    <div>
        <h1>Arhiiv</h1>
        <div class="d-flex flex-column">
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-14' } }"
                >14. jaanuari testetendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-16' } }"
                >16. jaanuari testetendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-17' } }"
                >17. jaanuari kontrolletendus
            </RouterLink>
            <!--            <RouterLink-->
            <!--                :to="{ name: 'archive.date', params: { date: '2023-01-18' } }"-->
            <!--                >18. jaanuari esietendus-->
            <!--            </RouterLink>-->
            <!--            <RouterLink-->
            <!--                :to="{ name: 'archive.date', params: { date: '2023-01-19' } }"-->
            <!--                >19. jaanuari etendus-->
            <!--            </RouterLink>-->
            <a class="py-2" href="/kava">Vaata kavalehte</a>
        </div>
    </div>
</template>
