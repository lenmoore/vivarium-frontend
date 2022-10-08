import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// axios.defaults.baseURL = 'http://localhost:80/api';

function authHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return  `Bearer ${localStorage.accessToken}`;
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


const instance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader(),
    },
    baseURL: 'http://localhost:3000/api',
});

export default instance;