import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useMainStore } from './store';
import { createPinia, setActivePinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

setActivePinia(pinia);
app.use(pinia);

const store = useMainStore(pinia);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(store);

app.use(router);

app.mount('#app');

router.beforeEach((to) => {
    // ✅ This will work because the router starts its navigation after
    // the router is installed and pinia will be installed too
    const store = useMainStore();

    if (to.meta.requiresAuth && !store.isLoggedIn) return '/login';
});
