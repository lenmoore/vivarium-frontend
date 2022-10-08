// import { useAuthStore } from "@/store/auth.store";

class TokenService {
    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.accessToken;
    }

    updateLocalAccessToken(token: string) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.accessToken = token;
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    setUser(user: User) {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', user.accessToken.slice(1, -1)); // it has " at beginning and end
        // const authStore = useAuthStore();
        // return authStore.setUser(user);
    }

    removeUser() {
        localStorage.removeItem('user');
    }
}

export default new TokenService();
