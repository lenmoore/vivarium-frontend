import { defineStore } from 'pinia';
import AuthService from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
    }),
    getters: {},
    actions: {
        login(username: string, password: string) {
            AuthService.login(username, password).then((data) => {
                console.log(data);
            });
        },
    },
});
