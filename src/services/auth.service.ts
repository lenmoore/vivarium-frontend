import TokenService from '../services/token.service';
import api from '../services/api';
import router from '../router';

class AuthService {
    async login(email: string, password: string) {
        return await api
            .post(`/sessions`, {
                email: email,
                password: password,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    const user = {
                        ...response.data,
                        email: email,
                    };
                    TokenService.setUser(user);

                    router.push('/admin');
                }
            });
    }

    logout() {
        // localStorage.removeItem('user');
        TokenService.removeUser();
        router.push('/');
    }

    register(email: string, password: string) {
        return api.post('/users', {
            email,
            password,
        });
    }
}

export default new AuthService();
