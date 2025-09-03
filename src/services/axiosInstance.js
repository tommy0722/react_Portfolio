// src/utils/axiosInstance.js
import axios from 'axios';

// 配置常量
const API_CONFIG = {
    PRODUCTION_URL: 'https://myweb-backend-571409330129.asia-east1.run.app/api',
    DEVELOPMENT_URL: 'http://127.0.0.1:8000/api',
    TIMEOUT: 10000, // 10秒超時
};

// 根據環境選擇 baseURL
const baseURL = process.env.NODE_ENV === 'production' 
    ? API_CONFIG.PRODUCTION_URL 
    : API_CONFIG.DEVELOPMENT_URL;

// 創建 axios 實例
const instance = axios.create({ 
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 存儲 token 的安全方法
const TokenManager = {
    getToken: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading token from localStorage:', error);
            return null;
        }
    },
    
    setToken: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Error storing token in localStorage:', error);
        }
    },
    
    removeToken: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing token from localStorage:', error);
        }
    },
    
    clearAllTokens: () => {
        try {
            ['access', 'refresh', 'user_email', 'user_name'].forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }
};

// 請求攔截器
instance.interceptors.request.use(
    config => {
        // 添加請求時間戳用於日誌
        config.metadata = { startTime: new Date() };
        
        // 自動添加 access token
        const token = TokenManager.getToken('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 響應攔截器
instance.interceptors.response.use(
    response => {
        // 計算請求時間
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        
        // 開發環境下記錄請求時間
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // 處理網路錯誤
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject({
                ...error,
                message: '網路連接失敗，請檢查您的網路連接'
            });
        }

        // 處理超時錯誤
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error);
            return Promise.reject({
                ...error,
                message: '請求超時，請稍後再試'
            });
        }

        // 處理 401 未授權錯誤
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = TokenManager.getToken('refresh');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${baseURL}/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccess = res.data.access;
                    TokenManager.setToken('access', newAccess);

                    // 更新請求頭並重試原始請求
                    originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    
                    // 清除所有 token 並重定向到登入頁
                    TokenManager.clearAllTokens();
                    
                    // 避免在登入頁面再次重定向
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    
                    return Promise.reject({
                        ...refreshError,
                        message: '登入已過期，請重新登入'
                    });
                }
            } else {
                // 沒有 refresh token，直接重定向
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        // 處理其他 HTTP 錯誤
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.detail ||
                           `請求失敗 (${error.response?.status})`;

        return Promise.reject({
            ...error,
            message: errorMessage
        });
    }
);

// 導出實例和 TokenManager
export default instance;
export { TokenManager };
