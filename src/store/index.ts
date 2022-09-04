import { defineStore } from 'pinia';

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
    state: () => ({
        counter: 0,
        name: 'Lena',
        isLoggedIn: false,
    }),
    getters: {
        doubleCount: (state) => {
            return state.counter * 2;
        },
    },
    actions: {
        async reset() {
            this.counter = 0;
        },
        addOne() {
            this.counter++;
        },
    },
});
