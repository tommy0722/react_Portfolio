// src/utils/axiosInstance.js
import axios from 'axios';

const baseURL = 'https://myweb-backend-571409330129.asia-east1.run.app/api';
// const baseURL = 'http://127.0.0.1:8000/api';

const instance = axios.create({ baseURL });

// 自動加上 access token
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 自動處理 401 並嘗試刷新 token
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 如果是 401，並且還沒 retry 過（避免無限循環）
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${baseURL}/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccess = res.data.access;
                    localStorage.setItem('access', newAccess);

                    // 更新 header 並重新送出原始請求
                    originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                    return instance(originalRequest);
                } catch (err) {
                    console.error('Refresh token 無效，請重新登入');
                    // 你也可以做登出處理或跳轉
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
