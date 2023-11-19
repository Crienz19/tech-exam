import axios from 'axios';
import { useAuthStore } from '@/store/auth';

axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
};

let url = 'http://localhost/api/v1/';

export const ApiRequest = axios.create({
    baseURL: url,
    withCredentials: true
});

ApiRequest.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    config.headers.Accept = "application/json";
    config.headers['Content-Type'] = "application/json";
    
    return config
})

export const ApiRequestWithoutAuth = axios.create({
    baseURL: url,
    withCredentials: true
});