import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { store } from "../store/store";
import { clearAccessToken, setAccessToken } from "../slices/auth.slice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.log("originalRequest?._retry", originalRequest?._retry);
    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    console.log("originalRequest", originalRequest);
    originalRequest._retry = true;

    try {
      const response = await api.post("/auth/refresh");

      const newAccessToken = response.data.data.accessToken;

      store.dispatch(setAccessToken(newAccessToken));
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (error) {
      store.dispatch(clearAccessToken());

      return Promise.reject(error);
    }
  },
);

export default api;
