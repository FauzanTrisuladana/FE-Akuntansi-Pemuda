import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Serializable file representation that survives server function boundary
export type SerializedFile = {
  base64: string;
  name: string;
  type: string;
};

// Types
export type TransaksiBackend = {
  id: number;
  akun_id: number;
  penginput_id: number;
  penanggung_jawab_id: number;
  deskripsi: string | null;
  date: string;
  jenis_transaksi: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti: string | null;
  akun?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
  penginput?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    profile_image: string | null;
    has_password: boolean;
  };
  penanggung_jawab?: {
    id: number;
    nama: string;
    valuasi_transaksi: number;
  };
};

export type TransaksiCollectionResponse = {
  status: string;
  message: string;
  data: Array<TransaksiBackend>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  summary?: {
    total_pemasukan: number;
    total_pengeluaran: number;
  };
};

export type TransaksiSingleResponse = {
  status: string;
  message: string;
  data: TransaksiBackend;
};

export type IndexTransaksiParams = {
  page?: number;
  per_page?: number;
  search?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  jenis_transaksi?: Array<"pemasukan" | "pengeluaran">;
  kas?: Array<"17 an" | "kas pemuda">;
  akun?: number | null;
};

// Get list of transaksi
export const getTransaksiKeuangan = createServerFn({ method: "GET" })
  .validator((data: { params?: IndexTransaksiParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<TransaksiCollectionResponse>(
        "/transaksi",
        { params: data.params },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Create transaksi
export const createTransaksiKeuangan = createServerFn({ method: "POST" })
  .validator(
    (data: {
      deskripsi?: string;
      date: string;
      jenis_transaksi: "pemasukan" | "pengeluaran";
      akun_id: number;
      penanggung_jawab_id?: number;
      jumlah: number;
      bukti?: SerializedFile | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const formData = new FormData();
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      formData.append("date", data.date);
      formData.append("jenis_transaksi", data.jenis_transaksi);
      formData.append("akun_id", data.akun_id.toString());
      if (data.penanggung_jawab_id) {
        formData.append(
          "penanggung_jawab_id",
          data.penanggung_jawab_id.toString(),
        );
      }
      formData.append("jumlah", data.jumlah.toString());
      if (data.bukti) {
        const buffer = Buffer.from(data.bukti.base64, "base64");
        const blob = new Blob([buffer], { type: data.bukti.type });
        formData.append("bukti", blob, data.bukti.name);
      }

      const response = await api.post<TransaksiSingleResponse>(
        "/transaksi",
        formData,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Update transaksi
export const updateTransaksiKeuangan = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number;
      deskripsi?: string;
      date: string;
      jenis_transaksi: "pemasukan" | "pengeluaran";
      akun_id: number;
      penanggung_jawab_id?: number;
      jumlah: number;
      bukti?: SerializedFile | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      formData.append("date", data.date);
      formData.append("jenis_transaksi", data.jenis_transaksi);
      formData.append("akun_id", data.akun_id.toString());
      if (data.penanggung_jawab_id) {
        formData.append(
          "penanggung_jawab_id",
          data.penanggung_jawab_id.toString(),
        );
      }
      formData.append("jumlah", data.jumlah.toString());
      if (data.bukti) {
        const buffer = Buffer.from(data.bukti.base64, "base64");
        const blob = new Blob([buffer], { type: data.bukti.type });
        formData.append("bukti", blob, data.bukti.name);
      }

      const response = await api.post<TransaksiSingleResponse>(
        `/transaksi/${data.id}`,
        formData,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Delete transaksi
export const deleteTransaksiKeuangan = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<TransaksiSingleResponse>(
        `/transaksi/${data.id}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
