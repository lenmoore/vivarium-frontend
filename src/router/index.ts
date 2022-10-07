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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
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
