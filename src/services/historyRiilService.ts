import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type HistoryRiilBackend = {
  id: number;
  date: string;
  verified: boolean;
  riil: string;
  akun?: {
    id: number;
    nama_akun: string;
    kas: string;
    keterangan: string | null;
  };
};

export type HistoryRiilIndexParams = {
  page?: number;
  per_page?: number;
  search?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  kas?: Array<string>;
};

export type HistoryRiilCollectionResponse = {
  status: string;
  message: string;
  data: Array<HistoryRiilBackend>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

// Get list of history riil
export const getHistoryRiil = createServerFn({ method: "GET" })
  .validator((data: { params?: HistoryRiilIndexParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<HistoryRiilCollectionResponse>(
        "/history-riil",
        { params: data.params },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Verify history riil
export const verifyHistoryRiil = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<{
        status: string;
        message: string;
        data: HistoryRiilBackend;
      }>(`/history-riil/${data.id}/verify`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
