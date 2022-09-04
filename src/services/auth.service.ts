import TokenService from '@/services/token.service';
import api from '@/services/api';

class AuthService {
    login(email: string, password: string) {
        console.log('hello');
        // todo sends to wrong url for some reason?!
        return api
            .post('/sessions', {
                email,
                password,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    // localStorage.setItem('user', JSON.stringify(response.data));
                    TokenService.setUser(response.data);
                }

                return response.data;
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
