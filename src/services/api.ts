import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { ref } from 'vue';

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

const isAdmin = ref(localStorage.getItem('admin') === 'true');
const isActor = ref(localStorage.getItem('actor') === 'true');

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
// const vatteater = 'https://192.168.1.153:3000/api';
const vatteater = 'https://192.168.1.166:3000/api';
const localHttps = 'https://localhost:3000/api';
const tina = 'https://10.0.0.244:3000/api';
const tina2 = 'http://127.0.0.1:3000/api';
const nothing = 'https://192.168.95.106:3000/api';

const gons2 = 'https://192.168.8.102:3000/api';
const herokuapi = 'https://api-vivaarium.herokuapp.com/api';
const sitt = 'http://localhost:3000/api';
const corsAnywhere = 'https://ancient-oasis-40097.herokuapp.com/';
const vatheroku = 'https://vat-vivaarium.herokuapp.com';
const DEPLOY = herokuapi;
const ACTOR_DEPLOY = 'https://api-vivaarium-actors.herokuapp.com/api';
const newHeroku = 'https://viva-back-2.herokuapp.com/api';

const instance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader().toString(),
        'X-Refresh': refreshHeader().toString(),
        'X-Forwarded-For': corsAnywhere + herokuapi,
    },
    // baseURL: isAdmin.value || isActor.value ? ACTOR_DEPLOY : DEPLOY,
    baseURL: newHeroku,
});

export default instance;
