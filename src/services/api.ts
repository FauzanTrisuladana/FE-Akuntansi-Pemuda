import axios from "axios";
import { deleteCookie, getCookie, getEvent } from "vinxi/http";
import { redirect } from "@tanstack/react-router";
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
  const event = getEvent();
  const token = event ? getCookie(event, "token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const event = getEvent();
      if (event) {
        deleteCookie(event, "token");
        deleteCookie(event, "user");
      }

      throw redirect({
        to: "/login",
      });
    }

    if (error.code === "ECONNABORTED") {
      console.warn("Request timed out (10s limit exceeded)");
    }

    return Promise.reject(error);
  },
);
