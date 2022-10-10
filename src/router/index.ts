import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Auth/LoginView.vue'),
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin/AdminHome.vue'),
        children: [
            {
                path: '/humanity-shop',
                name: 'admin.humanity-shop',
                component: () =>
                    import('../views/HumanityShop/HumanityShopHome.vue'),
                children: [
                    {
                        path: 'shop-data',
                        name: 'admin.humanity-shop.shop-data',
                        component: () =>
                            import(
                                '../views/HumanityShop/Admin/ShopDataVisualization.vue'
                            ),
                        children: [
                            {
                                path: ':id',
                                name: 'admin.humanity-shop.shop-data.product',
                                component: () =>
                                    import(
                                        '../views/HumanityShop/Admin/ProductDetails.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'performance-manager',
                name: 'admin.performance-manager',
                component: () =>
                    import('../views/Performance/PerformanceManager.vue'),
            },
        ],
    },
    {
        path: '/humanity-shop',
        name: 'humanity-shop',
        component: () => import('../views/HumanityShop/HumanityShopHome.vue'),
        children: [
            {
                path: 'shop-data',
                name: 'humanity-shop.shop-data',
                component: () =>
                    import(
                        '../views/HumanityShop/Admin/ShopDataVisualization.vue'
                    ),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;
