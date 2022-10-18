import { defineStore } from 'pinia';
import api from '../services/api';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `usebasketStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
    state: () => ({
        counter: 0,
        healthCheckResult: '',
    }),
    getters: {
        doubleCount: (state) => {
            return state.counter * 2;
        },
        getHealthStatus: (state) => {
            return state.healthCheckResult;
        },
    },
    actions: {
        async healthCheck() {
            return await api.get('/health-check').then((res) => {
                this.healthCheckResult = res.data;
            });
        },
        async reset() {
            this.counter = 0;
        },
        addOne() {
            this.counter++;
        },
    },
});
