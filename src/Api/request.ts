// src/utils/request.ts
import axios from 'axios';

const request = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    console.log(`请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('请求失败:', error);
    return Promise.reject(error);
  }
);

// 只导出 get 方法（根据你的需求）
export const get = <T = any>(url: string, params?: any): Promise<T> => {
  return request.get(url, { params });
};

export default request;