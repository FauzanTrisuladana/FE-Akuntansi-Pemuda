import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";
import type { TransactionBackend } from "@/components/pengaturan-akun-keuangan/types";

// Types
export type AkunKeuanganRecord = {
  id: number;
  nama_akun: string;
  kas: string;
  jumlah: number;
  keterangan?: string | null;
};

// Re-export TransactionBackend from types
export type { TransactionBackend } from "@/components/pengaturan-akun-keuangan/types";

export type AkunKeuanganResponse = {
  status: string;
  message: string;
  data: AkunKeuanganRecord;
};

export type MutasiRekeningBackend = {
  id: number;
  akun_debit_id: number;
  akun_kredit_id: number;
  date: string;
  jumlah: number;
  keterangan: string;
};

export type AkunKeuanganWithTransactionsResponse = {
  status: string;
  message: string;
  data: AkunKeuanganRecord & {
    mutasi_debit?: Array<MutasiRekeningBackend>;
    mutasi_kredit?: Array<MutasiRekeningBackend>;
    transaksi: Array<TransactionBackend>;
  };
};

export type AkunKeuanganCollectionResponse = {
  status: string;
  message: string;
  data: Array<AkunKeuanganRecord>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type IndexAkunParams = {
  page?: number;
  per_page?: number;
  search?: string;
  kas?: Array<string>;
};

export type StoreAkunPayload = {
  nama_akun: string;
  kas: string;
  keterangan?: string;
};

export type UpdateAkunPayload = {
  nama_akun?: string;
  kas?: string;
  keterangan?: string;
};

// Get list of akun keuangan
export const getAkunKeuangan = createServerFn({ method: "GET" })
  .validator((data: { params?: IndexAkunParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<AkunKeuanganCollectionResponse>("/akun", {
        params: data.params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Get akun keuangan with transactions
export const getAkunKeuanganDetail = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }): Promise<AkunKeuanganWithTransactionsResponse> => {
    try {
      const response = await api.get<AkunKeuanganWithTransactionsResponse>(
        `/akun/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  });

// Create akun keuangan
export const createAkunKeuangan = createServerFn({ method: "POST" })
  .validator((data: StoreAkunPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<AkunKeuanganResponse>("/akun", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Update akun keuangan
export const updateAkunKeuangan = createServerFn({ method: "POST" })
  .validator((data: UpdateAkunPayload & { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<AkunKeuanganResponse>(`/akun/${data.id}`, {
        nama_akun: data.nama_akun,
        kas: data.kas,
        keterangan: data.keterangan,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Delete akun keuangan
export const deleteAkunKeuangan = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<AkunKeuanganResponse>(
        `/akun/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
