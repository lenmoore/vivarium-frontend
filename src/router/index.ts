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
                redirect: { name: 'admin.humanity-shop.products' },
                component: () =>
                    import('../views/HumanityShop/HumanityShopHome.vue'),
                children: [
                    {
                        path: 'products',
                        name: 'admin.humanity-shop.products',
                        component: () =>
                            import(
                                '../views/HumanityShop/Admin/ProductsList.vue'
                            ),
                        children: [],
                    },
                    {
                        path: 'product/:id',
                        name: 'admin.humanity-shop.products.details',
                        component: () =>
                            import(
                                '../views/HumanityShop/Admin/ProductDetails.vue'
                            ),
                    },
                    {
                        path: 'shop-data',
                        name: 'admin.humanity-shop.shop-data',
                        component: () =>
                            import(
                                '../views/HumanityShop/Admin/ShopDataVisualization.vue'
                            ),
                    },
                ],
            },
            {
                path: 'performances',
                name: 'admin.performances',
                component: () =>
                    import('../views/Performance/PerformanceIndex.vue'),
                redirect: { name: 'admin.performance-manager' },
                children: [
                    {
                        path: 'manage',
                        name: 'admin.performance-manager',
                        component: () =>
                            import(
                                '../views/Performance/PerformanceManager.vue'
                            ),
                        children: [],
                    },
                    {
                        path: ':id',
                        name: 'admin.performance-manager.performance',
                        component: () =>
                            import(
                                '../views/Performance/Instance/InstanceManager.vue'
                            ),
                    },
                ],
            },
        ],
    },

    {
        path: '/visitor-login',
        name: 'visitor.login',
        component: () => import('../views/VisitorAuth/VisitorLogin.vue'),
    },
    {
        path: '/visitor',
        name: 'visitor',
        component: () =>
            import(
                '../views/HumanityShop/VisitorInteractions/VisitorIndex.vue'
            ),
        children: [
            {
                path: 'humanity-shop',
                name: 'visitor.humanity-shop',
                component: () =>
                    import(
                        '../views/HumanityShop/VisitorInteractions/HumanityShopHome.vue'
                    ),
                children: [
                    {
                        path: 'cart',
                        name: 'visitor.humanity-shop.cart',
                        component: () =>
                            import(
                                '../views/HumanityShop/VisitorInteractions/VisitorCart.vue'
                            ),
                    },
                    {
                        path: 'scan',
                        name: 'visitor.humanity-shop.scan',
                        component: () =>
                            import(
                                '../views/HumanityShop/VisitorInteractions/VisitorScanner.vue'
                            ),
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;
