import axios from 'axios';

import store from '../../app/redux/store';

import { logoutUser } from '../../features/User/redux/authActions';

/*

|--------------------------------------------------------------------------

| Base axios instance

|--------------------------------------------------------------------------

*/

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',

  timeout: 10000,
});

/*

|--------------------------------------------------------------------------

| Request interceptor — DRY token attach

|--------------------------------------------------------------------------

*/

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    // Добавляем токен всегда, если он есть

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/*

|--------------------------------------------------------------------------

| Refresh control variables

|--------------------------------------------------------------------------

*/

let isRefreshing = false;

let failedQueue = [];

/*

|--------------------------------------------------------------------------

| Queue processor

|--------------------------------------------------------------------------

*/

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
};

/*

|--------------------------------------------------------------------------

| Response interceptor — refresh & retry logic

|--------------------------------------------------------------------------

*/

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Если нет response (network error, CORS, timeout)

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Работаем только с 401

    if (status !== 401) {
      return Promise.reject(error);
    }

    // Защита от бесконечного цикла

    if (originalRequest._retry) {
      store.dispatch(logoutUser());

      return Promise.reject(error);
    }

    // Если refresh уже идёт — ставим запрос в очередь

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('Refresh token missing');
      }

      // ⚠️ ВАЖНО: используем ЧИСТЫЙ axios

      const { data } = await axios.post(
        'http://127.0.0.1:8080/user_api/token/refresh/',

        { refresh: refreshToken }
      );

      const newAccessToken = data.access;

      // Обновляем токен в storage

      localStorage.setItem('accessToken', newAccessToken);

      // Обновляем дефолтный header

      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

      // Прокидываем токен ожидающим запросам

      processQueue(null, newAccessToken);

      // Повторяем исходный запрос

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      store.dispatch(logoutUser());

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
