import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";
import type { User } from "./authService";
import type { SerializedFile } from "./transaksiService";

export type ProfileResponse = {
  status: string;
  message: string;
  data: User;
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

export const getProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<ProfileResponse>("/profile/me");
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

export const updateProfile = createServerFn({ method: "POST" })
  .validator((data: UpdateProfilePayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<ProfileResponse>("/profile/update", data);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  });

export const updatePassword = createServerFn({ method: "POST" })
  .validator((data: UpdatePasswordPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<ProfileResponse>(
        "/profile/update-password",
        data,
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  });

export const updateProfilePhoto = createServerFn({ method: "POST" })
  .validator((data: { profile_image: SerializedFile }) => data)
  .handler(async ({ data }) => {
    try {
      const formData = new FormData();
      const binaryString = atob(data.profile_image.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.profile_image.type });
      formData.append("profile_image", blob, data.profile_image.name);
      const response = await api.post<ProfileResponse>(
        "/profile/update-photo",
        formData,
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  });
