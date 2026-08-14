import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export const get = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => api.get(url, config);

export const post = <T>(url: string, data?: unknown): Promise<ApiResponse<T>> =>
  api.post(url, data);

export const put = <T>(url: string, data?: unknown): Promise<ApiResponse<T>> =>
  api.put(url, data);

export const del = <T>(url: string): Promise<ApiResponse<T>> => api.delete(url);

export default api;
