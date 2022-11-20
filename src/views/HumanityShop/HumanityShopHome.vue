<template>
    <div>
        <div class="container">
            <!--            <nav>-->
            <!--                <RouterLink :to="{ name: 'admin.humanity-shop.shop-data' }">-->
            <!--                    Data visualisation-->
            <!--                </RouterLink>-->
            <!--                <RouterLink :to="{ name: 'admin.humanity-shop.products' }">-->
            <!--                    Products-->
            <!--                </RouterLink>-->
            <!--            </nav>-->
        </div>
        <RouterView :key="$route.fullPath" />
    </div>
</template>

<script setup></script>
