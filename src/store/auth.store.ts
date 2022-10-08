import { defineStore } from 'pinia';
import AuthService from '../services/auth.service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: {
            accessToken: '',
            refreshToken: '',
            name: '',
        },
    }),
    getters: {},
    actions: {
        async login(username: string, password: string) {
            console.log('login function in store');
            try {
                console.log('hello?');
                return await AuthService.login(username, password);
            } catch (e) {
                console.log(e);
            }
        },
        async setUser(user: User) {
            this.user = user;
        },
    },
});
