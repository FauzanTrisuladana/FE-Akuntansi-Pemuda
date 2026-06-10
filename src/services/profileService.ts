import { api } from "./api";
import type { User } from "./authService";

export type ProfileData = {
  user: User;
};

export type UpdateProfilePayload = {
  name: string;
  email: string;
};

export type UpdatePasswordPayload = {
  current_password?: string;
  password: string;
  password_confirmation: string;
};

export const getProfile = async () => {
  const response = await api.get<{ status: string; data: ProfileData }>(
    "/profile/me",
  );
  return response.data.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await api.put<{ status: string; data: ProfileData }>(
    "/profile/update",
    data,
  );
  return response.data.data;
};

export const updatePassword = async (data: UpdatePasswordPayload) => {
  const response = await api.put<{ status: string; message: string }>(
    "/profile/update-password",
    data,
  );
  return response.data;
};
