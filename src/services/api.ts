import axios from "axios";
import { getRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { parse } from "cookie";
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
  const request = getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const cookieHeader = request?.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
