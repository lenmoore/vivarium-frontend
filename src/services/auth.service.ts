import TokenService from '../services/token.service';
import api from '../services/api';
import router from '../router';
import { decodeJwt } from 'jose';

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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const decoded = decodeJwt(response.data.accessToken);
                    console.log(decoded);
                    user.admin = decoded.admin;
                    localStorage.setItem('admin', user.admin);
                    localStorage.setItem('actor', user.actor);
                    localStorage.setItem('actor_color', user.actor_color);
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
