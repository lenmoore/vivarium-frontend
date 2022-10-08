import TokenService from '../services/token.service';
import api from '../services/api';
import router from '../router';
import axios from 'axios';
class AuthService {
    async login(email: string, password: string) {
        console.log('trying to log in');
        const user = await api
            .post(`/sessions`, {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log('response->', response);
                if (response.data.accessToken) {
                    const user = {
                        ...response.data,
                        email: email,
                    };
                    TokenService.setUser(user);

                    router.push('/admin');
                }

                return response;
            });
        console.log(user);
        return user;
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
