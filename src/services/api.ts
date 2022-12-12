import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// axios.defaults.baseURL = 'http://localhost:80/api';

function refreshHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return `${localStorage.refreshToken?.toString().trim()}`;
    } else {
        return '';
    }
}

function authHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return `Bearer ${localStorage.accessToken?.toString().trim()}`;
    } else {
        return '';
    }
}

// function handleResponse(response) {
//     return response.text().then((text) => {
//         const data = text && JSON.parse(text);
//
//         if (!response.ok) {
//             const { user, logout } = useAuthStore();
//             if ([401, 403].includes(response.status) && user) {
//                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//                 logout(); // todo i like this idea but im also handling it with routing
//             }
//
//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }
//
//         return data;
//     });
// }
const gonsiori = 'https://192.168.8.102:3000/api';
const gons2 = 'https://192.168.8.102:3000/api';
// const vatteater = 'https://192.168.1.153:3000/api';
const vatteater = 'https://192.168.1.187:3000/api';
const localHttps = 'https://localhost:3000/api';
const tina = 'https://10.0.0.244:3000/api';
const nothing = 'https://192.168.237.106:3000/api';
const instance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader().toString(),
        'X-Refresh': refreshHeader().toString(),
    },
    baseURL: gons2,
});

export default instance;
