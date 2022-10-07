import axios, { AxiosInstance } from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

const instance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    baseURL: 'http://localhost:3000/api',
});

export default instance;
