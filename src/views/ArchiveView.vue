<template>
    <div class="container">
        <h1>Arhiiv</h1>

        <div class="d-flex flex-column date-list">
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-18' } }"
                >18. jaanuari ESIETENDUS
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-19' } }"
                >19. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-20' } }"
                >20. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-21' } }"
                >21. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-23' } }"
                >23. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-24' } }"
                >24. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-25' } }"
                >25. jaanuari etendus
            </RouterLink>
            <RouterLink
                :to="{ name: 'archive.date', params: { date: '2023-01-26' } }"
                >26. jaanuari etendus
            </RouterLink>
            <!--                        <RouterLink-->
            <!--                            :to="{ name: 'archive.date', params: { date: '2023-01-27' } }"-->
            <!--                            >27. jaanuari etendus-->
            <!--                        </RouterLink>-->
            <a class="py-4" href="/kava"><strong>Vaata kavalehte</strong></a>
        </div>
    </div>
</template>
<style lang="scss">
.date-list {
    * {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
}
</style>
