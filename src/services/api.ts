import axios, { AxiosInstance } from 'axios';

axios.defaults.baseURL = 'http://localhost:80/api';

const instance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
    },
    timeout: 10000,
    baseURL: 'http://localhost:80/api',
});

export default instance;
