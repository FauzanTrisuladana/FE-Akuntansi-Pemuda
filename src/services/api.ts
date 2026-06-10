import axios from "axios";
import { deleteCookie, getCookie, getEvent } from "vinxi/http";
import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof document === "undefined") {
    try {
      const event = getEvent();
      const token = getCookie(event, "token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      if (typeof document !== "undefined") {
        deleteCookie("token");
        deleteCookie("user");
        window.location.href = "/login";
      } else {
        const event = getEvent();
        deleteCookie(event, "token");
        deleteCookie(event, "user");
        // redirect("/login"); --- IGNORE ---
      }
    }

    return Promise.reject(error);
  }
);