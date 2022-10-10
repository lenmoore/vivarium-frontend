import { defineStore } from 'pinia';
import AuthService from '../services/auth.service';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: {
            accessToken: '',
            refreshToken: '',
            name: '',
        },
    }),
    getters: {
        isAuthorized() {
            return !['', null, undefined].includes(
                localStorage.getItem('accessToken')
            );
        },
    },
    actions: {
        async login(username: string, password: string) {
            try {
                await AuthService.login(username, password);
            } catch (e) {
                console.log(e);
            }
        },
        async setUser(user: User) {
            this.user = user;
        },
        async logout() {
            this.user.accessToken = '';
            this.user.refreshToken = '';
            this.user.name = '';
            localStorage.clear();
            return true;
        },
    },
});
