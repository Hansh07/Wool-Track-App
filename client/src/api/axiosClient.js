import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach access token & fix path duplication
axiosClient.interceptors.request.use(
    (config) => {
        // Fix potential double /api prefix (e.g. baseURL=/api + url=/api/auth)
        if (config.baseURL?.endsWith('/api') && config.url?.startsWith('/api')) {
            config.url = config.url.replace('/api', '');
        }

        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = 'Bearer ' + token;
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// Response interceptor - auto-refresh on 401 TOKEN_EXPIRED
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                processQueue(new Error('No refresh token'), null);
                isRefreshing = false;
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken });
                const newAccessToken = res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;
                localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
                axiosClient.defaults.headers.common.Authorization = 'Bearer ' + newAccessToken;
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);
                isRefreshing = false;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
