import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type PenanggungJawabRecord = {
  id: number;
  nama: string;
  valuasi_transaksi: number;
};

export type TransactionPJBackend = {
  id: number;
  akun_id: number;
  penginput_id: number;
  penanggung_jawab_id: number;
  deskripsi: string;
  date: string;
  jenis_transaksi: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti: string | null;
  akun?: { id: number; nama: string };
};

export type PenanggungJawabResponse = {
  status: string;
  message: string;
  data: PenanggungJawabRecord;
};

export type PenanggungJawabWithTransactionsResponse = {
  status: string;
  message: string;
  data: PenanggungJawabRecord & {
    transaksi: Array<TransactionPJBackend>;
  };
};

export type PenanggungJawabCollectionResponse = {
  status: string;
  message: string;
  data: Array<PenanggungJawabRecord>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type IndexPJParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type StorePJPayload = {
  nama: string;
};

export type UpdatePJPayload = {
  nama: string;
};

// Get list of penanggung jawab
export const getPenanggungJawab = createServerFn({ method: "GET" })
  .validator((data: { params?: IndexPJParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<PenanggungJawabCollectionResponse>(
        "/penanggung-jawab",
        { params: data.params },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Get penanggung jawab with transactions
export const getPenanggungJawabDetail = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<PenanggungJawabWithTransactionsResponse>(
        `/penanggung-jawab/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Create penanggung jawab
export const createPenanggungJawab = createServerFn({ method: "POST" })
  .validator((data: StorePJPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<PenanggungJawabResponse>(
        "/penanggung-jawab",
        data,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Update penanggung jawab
export const updatePenanggungJawab = createServerFn({ method: "POST" })
  .validator((data: UpdatePJPayload & { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<PenanggungJawabResponse>(
        `/penanggung-jawab/${data.id}`,
        { nama: data.nama },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Delete penanggung jawab
export const deletePenanggungJawab = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<PenanggungJawabResponse>(
        `/penanggung-jawab/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });