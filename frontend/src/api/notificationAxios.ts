import axios from "axios";
import { store } from "../store/store";

const notificationApi = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_URL,
  withCredentials: true,
});

notificationApi.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default notificationApi;
