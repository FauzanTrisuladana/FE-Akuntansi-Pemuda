import { createServerFn } from "@tanstack/react-start";
import { getEvent, setCookie } from "vinxi/http";
import { api } from "./api";
import { handleApiError } from "./errorService";
import { env } from "@/env";

// Types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profile_image: string | null;
  has_password: boolean;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: User;
  auth: {
    token: string;
    token_type: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginGoogleCredentials {
  id_token: string;
}

export const login = createServerFn({ method: "POST" })
  .validator((data: LoginCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      const { token, token_type } = response.data.auth;
      const user = response.data.data;

      const event = getEvent();

      setCookie(event, "token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      setCookie(event, "user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      return { ...response.data, token, token_type };
    } catch (error) {
      handleApiError(error);
    }
  });

export const loginWithGoogle = createServerFn({ method: "POST" })
  .validator((data: LoginGoogleCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login-google", data);
      const { token, token_type } = response.data.auth;
      const user = response.data.data;

      const event = getEvent();

      setCookie(event, "token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      setCookie(event, "user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      return { ...response.data, token, token_type };
    } catch (error) {
      handleApiError(error);
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    handleApiError(error);
  } finally {
    const event = getEvent();
    setCookie(event, "token", "", {
      httpOnly: true,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    setCookie(event, "user", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
  }
});

export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user="),
  );

  return !!userCookie;
};
