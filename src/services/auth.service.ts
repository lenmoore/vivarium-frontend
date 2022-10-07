import TokenService from '../services/token.service';
import api from '../services/api';
import { useMainStore } from '@/store';
import router from '../router';
import axios from 'axios';

class AuthService {
    async login(email: string, password: string) {
        await api
            .post(`/sessions`, {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log('response->', response);
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    TokenService.setUser(response.data);

                    const { setLoggedInStatus } = useMainStore();
                    setLoggedInStatus(true);
                    // router.push('/');
                }

                console.log('BRO');
                console.log(response);
                console.log('listen this is the post');
                return response;
            });
    }

    logout() {
        // localStorage.removeItem('user');
        TokenService.removeUser();
    }

    register(email: string, password: string) {
        return api.post('/users', {
            email,
            password,
        });
    }
}

export default new AuthService();
