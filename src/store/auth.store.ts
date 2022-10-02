import { defineStore } from 'pinia';
import AuthService from '../services/auth.service';

const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: {},
    }),
    getters: {},
    actions: {
        login(username: string, password: string) {
            console.log('bro login function in store');
            try {
                return AuthService.login(username, password).then((data) => {
                    console.log(data);
                    this.isLoggedIn = true;
                });
            } catch (e) {
                console.log(e);
            }
        },
    },
});
export default useAuthStore;
