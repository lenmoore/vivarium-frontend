import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useMainStore } from './store';
import { createPinia, setActivePinia } from 'pinia';

import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import '../src/assets/common.scss';
const app = createApp(App);
const pinia = createPinia();

setActivePinia(pinia);
app.use(pinia);

const store = useMainStore(pinia);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(store);
app.use(BootstrapVue3);

app.use(router);

app.mount('#app');

// router.beforeEach((to) => {
//     // ✅ This will work because the router starts its navigation after
//     // the router is installed and pinia will be installed too
//     const store = useMainStore();
//
//     if (to.meta.requiresAuth && !store.isLoggedIn) return '/login';
// });
