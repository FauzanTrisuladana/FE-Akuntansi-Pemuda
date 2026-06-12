import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type MutasiRekeningBackend = {
  id: number;
  akun_debit_id: number;
  akun_kredit_id: number;
  date: string;
  jumlah: number;
  keterangan: string | null;
  akun_debit?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
  akun_kredit?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
};

export type MutasiRekeningIndexParams = {
  page?: number;
  per_page?: number;
  search?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  kas?: Array<string>;
  akun?: number;
};

export type MutasiRekeningCollectionResponse = {
  status: string;
  message: string;
  data: Array<MutasiRekeningBackend>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type StoreMutasiPayload = {
  akun_debit_id: number;
  akun_kredit_id: number;
  date: string;
  jumlah: number;
  keterangan?: string;
  kas: string;
};

export type UpdateMutasiPayload = {
  akun_debit_id?: number;
  akun_kredit_id?: number;
  date?: string;
  jumlah?: number;
  keterangan?: string;
};

// Get list of mutasi rekening
export const getMutasiRekening = createServerFn({ method: "GET" })
  .validator((data: { params?: MutasiRekeningIndexParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<MutasiRekeningCollectionResponse>(
        "/mutasi-rekening",
        { params: data.params },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Create mutasi rekening
export const createMutasiRekening = createServerFn({ method: "POST" })
  .validator((data: StoreMutasiPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<{
        status: string;
        message: string;
        data: MutasiRekeningBackend;
      }>("/mutasi-rekening", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Update mutasi rekening
export const updateMutasiRekening = createServerFn({ method: "POST" })
  .validator((data: UpdateMutasiPayload & { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<{
        status: string;
        message: string;
        data: MutasiRekeningBackend;
      }>(`/mutasi-rekening/${data.id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Delete mutasi rekening
export const deleteMutasiRekening = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/mutasi-rekening/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
