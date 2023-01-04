import { defineStore } from 'pinia';
import AuthService from '../services/auth.service';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: {
            accessToken: '',
            refreshToken: '',
            name: '',
            admin: false,
            actor: false,
            actor_color: '',
        },
    }),
    getters: {
        isAuthenticated() {
            return !['', null, undefined].includes(
                localStorage.getItem('accessToken')
            );
        },
        isAdmin(state) {
            return state.user.admin;
        },
    },
    actions: {
        async login(username: string, password: string) {
            try {
                return await AuthService.login(username, password);
            } catch (e) {
                console.log(e);
            }
        },
        async setUser(user: any) {
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
