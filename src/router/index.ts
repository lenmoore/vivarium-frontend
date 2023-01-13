import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: '/visitor',
                name: 'visitor',
                component: () =>
                    import(
                        '../views/HumanityShop/VisitorInteractions/VisitorIndex.vue'
                    ),
                children: [
                    {
                        path: 'intro',
                        name: 'visitor.intro',
                        component: () =>
                            import('../views/VisitorAuth/VisitorIntro.vue'),
                    },
                    {
                        path: '/visitor/quiz',
                        name: 'visitor.quiz',
                        component: () =>
                            import(
                                '../views/HumanityQuestionnaire/QuestionnaireIndex.vue'
                            ),
                    },
                    {
                        path: 'humanity-shop',
                        name: 'visitor.humanity-shop',
                        component: () =>
                            import(
                                '../views/HumanityShop/VisitorInteractions/HumanityShopHome.vue'
                            ),
                        children: [
                            {
                                path: 'basket',
                                name: 'visitor.humanity-shop.basket',
                                component: () =>
                                    import(
                                        '../views/HumanityShop/VisitorInteractions/VisitorBasket.vue'
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
                            {
                                path: 'done',
                                name: 'basket-done',
                                component: () =>
                                    import(
                                        '../views/HumanityShop/VisitorInteractions/BasketIsDone.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '/character/:date/:wardrobe',
        name: 'character',
        component: () => import('../views/Character/CharacterSheet.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Auth/LoginView.vue'),
    },
    {
        path: '/superadmin',
        name: 'superadmin',
        component: () => import('../views/Admin/SuperAdmin/index.vue'),
        children: [
            {
                path: 'settings',
                name: 'superadmin.settings',
                component: () =>
                    import(
                        '../views/Admin/SuperAdmin/PhasesGamesManager/PhasesGamesManagerIndex.vue'
                    ),
                children: [
                    {
                        name: 'superadmin.games',
                        path: 'games',
                        component: () =>
                            import(
                                '../views/Admin/SuperAdmin/PhasesGamesManager/Games/SuperAdminGames.vue'
                            ),
                        children: [
                            {
                                path: 'game-details/:id',
                                name: 'superadmin.games.game-details',
                                component: () =>
                                    import(
                                        '../views/Admin/SuperAdmin/PhasesGamesManager/Games/GameSetup.vue'
                                    ),
                            },
                            {
                                path: 'humanity-shop',
                                name: 'superadmin.games.humanity-shop',
                                redirect: {
                                    name: 'superadmin.games.humanity-shop.products',
                                },
                                component: () =>
                                    import(
                                        '../views/HumanityShop/HumanityShopHome.vue'
                                    ),
                                children: [
                                    {
                                        path: 'products',
                                        name: 'superadmin.games.humanity-shop.products',
                                        component: () =>
                                            import(
                                                '../views/HumanityShop/Admin/ProductsList.vue'
                                            ),
                                        children: [],
                                    },
                                    {
                                        path: 'product/:id',
                                        name: 'superadmin.games.humanity-shop.details',
                                        component: () =>
                                            import(
                                                '../views/HumanityShop/Admin/ProductDetails.vue'
                                            ),
                                    },
                                    {
                                        path: 'product/:id/edit',
                                        name: 'superadmin.games.humanity-shop.edit',
                                        component: () =>
                                            import(
                                                '../views/HumanityShop/Admin/ProductEdit.vue'
                                            ),
                                    },
                                    {
                                        path: 'shop-data',
                                        name: 'superadmin.games.humanity-shop.shop-data',
                                        component: () =>
                                            import(
                                                '../views/HumanityShop/Admin/ShopDataVisualization.vue'
                                            ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'superadmin.phases',
                        path: 'phases',
                        component: () =>
                            import(
                                '../views/Admin/SuperAdmin/PhasesGamesManager/Phases/SuperAdminPhases.vue'
                            ),
                    },
                ],
            },
            {
                path: 'performances',
                name: 'superadmin.performances',
                component: () =>
                    import(
                        '../views/Admin/SuperAdmin/Performance/PerformanceIndex.vue'
                    ),
                redirect: { name: 'superadmin.performance-manager' },
                children: [
                    {
                        path: 'manage',
                        name: 'superadmin.performance-manager',
                        component: () =>
                            import(
                                '../views/Admin/SuperAdmin/Performance/PerformanceManager.vue'
                            ),
                        children: [],
                    },
                    {
                        path: ':id',
                        name: 'superadmin.performance-manager.performance',
                        component: () =>
                            import(
                                '../views/Admin/SuperAdmin/Performance/Instance/InstanceManager.vue'
                            ),
                    },
                ],
            },
        ],
    },
    {
        path: '/admin',
        name: 'admin.home',
        component: () => import('../views/Admin/AdminHome.vue'),
        children: [
            {
                path: 'audience',
                name: 'admin.audience',
                component: () =>
                    import('../views/Admin/AudienceInspector/AudienceList.vue'),
                children: [
                    {
                        path: 'overview',
                        name: 'admin.audience.overview',
                        component: () =>
                            import(
                                '../views/Admin/AudienceInspector/AudienceSummary.vue'
                            ),
                    },
                    {
                        path: 'products',
                        name: 'admin.audience.products',
                        component: () =>
                            import(
                                '../views/Admin/AudienceInspector/ProductsSummary.vue'
                            ),
                    },
                    {
                        path: 'quiz-in-capsule',
                        name: 'admin.audience.quiz-in-capsule',
                        component: () =>
                            import(
                                '../views/Admin/AudienceInspector/QuizSummary.vue'
                            ),
                    },
                    {
                        path: 'quiz-pre-capsule',
                        name: 'admin.audience.quiz-pre-capsule',
                        component: () =>
                            import(
                                '../views/Admin/AudienceInspector/QuizSummary.vue'
                            ),
                    },
                ],
            },
            {
                path: 'capsule',
                name: 'admin.capsule',
                component: () =>
                    import(
                        '../views/Admin/AudienceInspector/CapsuleInformation.vue'
                    ),
            },
        ],
    },

    {
        path: '/visitor-login',
        name: 'visitor.login',
        component: () => import('../views/VisitorAuth/VisitorLogin.vue'),
    },
    {
        path: '/visitor/quiz',
        name: 'visitor.quiz',
        component: () =>
            import('../views/HumanityQuestionnaire/QuestionnaireIndex.vue'),
    },
    {
        path: '/quiz-done',
        name: 'visitor.quiz.done',
        component: () =>
            import('../views/HumanityQuestionnaire/PhaseTwoIsDone.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;
