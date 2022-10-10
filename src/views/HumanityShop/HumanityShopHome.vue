<template>
    <div>
        <h1>Humanity Shop</h1>

        <div class="container">
            <nav>
                <RouterLink :to="{ name: 'admin.humanity-shop.shop-data' }">
                    Data visualisation
                </RouterLink>
                <RouterLink :to="{ name: 'admin.humanity-shop.products' }">
                    Products
                </RouterLink>
            </nav>
        </div>
        <RouterView />
    </div>
</template>

<script setup></script>
