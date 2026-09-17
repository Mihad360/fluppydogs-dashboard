import { TResponse } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_CONFIG } from "@/lib/auth/auth.config";

const axiosInstance = axios.create();

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers["Accept"] = "application/json";
axiosInstance.defaults.timeout = 60000;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      typeof window !== "undefined"
        ? Cookies.get(AUTH_CONFIG.TOKEN_COOKIE_KEY)
        : null;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — Intentionally returning custom TResponse shape
  function (response) {
    const responseObject: TResponse = {
      data: response?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  async function (error) {
    const responseError = {
      statusCode: error.response?.status,
      message: error.response?.data?.message || "Something went wrong",
      errorMessages: error.response?.data?.message,
    };

    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove(AUTH_CONFIG.TOKEN_COOKIE_KEY, {
        path: AUTH_CONFIG.COOKIE_PATH,
      });

      const path = window.location.pathname;
      if (!path.startsWith("/login")) {
        const redirect = encodeURIComponent(path);
        window.location.href = `/login?redirect=${redirect}`;
      }
    }

    return Promise.reject({
      response: {
        status: error.response?.status,
        data: responseError,
      },
    });
  },
);

export { axiosInstance };
