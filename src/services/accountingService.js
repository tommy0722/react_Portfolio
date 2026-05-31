import axios from './axiosInstance';

const BASE = '/accounting';

export const accountAPI = {
    list: () => axios.get(`${BASE}/accounts/`),
    create: (data) => axios.post(`${BASE}/accounts/`, data),
    update: (id, data) => axios.put(`${BASE}/accounts/${id}/`, data),
    remove: (id) => axios.delete(`${BASE}/accounts/${id}/`),
};

export const categoryAPI = {
    list: () => axios.get(`${BASE}/categories/`),
    create: (data) => axios.post(`${BASE}/categories/`, data),
    update: (id, data) => axios.put(`${BASE}/categories/${id}/`, data),
    remove: (id) => axios.delete(`${BASE}/categories/${id}/`),
};

export const transferAPI = {
    list: (params) => axios.get(`${BASE}/transfers/`, { params }),
    create: (data) => axios.post(`${BASE}/transfers/`, data),
    remove: (id) => axios.delete(`${BASE}/transfers/${id}/`),
};

export const transactionAPI = {
    list: (params) => axios.get(`${BASE}/transactions/`, { params }),
    create: (data) => axios.post(`${BASE}/transactions/`, data),
    update: (id, data) => axios.put(`${BASE}/transactions/${id}/`, data),
    remove: (id) => axios.delete(`${BASE}/transactions/${id}/`),
    summary: (params) => axios.get(`${BASE}/transactions/summary/`, { params }),
    monthlyTrend: () => axios.get(`${BASE}/transactions/monthly-trend/`),
};
