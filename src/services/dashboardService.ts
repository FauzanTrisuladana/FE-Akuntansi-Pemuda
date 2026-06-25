import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type DashboardSummary = {
  pemasukan: { total: number; change: number };
  pengeluaran: { total: number; change: number };
  totalSaldo: { total: number };
};

export type SaldoDailyRecord = {
  tanggal: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
};

export type SaldoPerAkunRecord = {
  tanggal: string;
  akun: Array<{ nama_akun: string; saldo: number }>;
};

export type RekonsiliasiRecord = {
  tanggal: string;
  sistem: number;
  riil: number;
  verified: number | null;
};

export type DashboardResponse = {
  status: string;
  message: string;
  data: {
    saldo_awal: number;
    saldo_daily: Array<SaldoDailyRecord>;
    saldo_per_akun: Array<SaldoPerAkunRecord>;
    rekonsiliasi: Array<RekonsiliasiRecord>;
  };
  summary: DashboardSummary;
};

export type IndexDashboardParams = {
  kas: string;
};

// Get dashboard data
export const getDashboard = createServerFn({ method: "GET" })
  .validator((data: { params: IndexDashboardParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<DashboardResponse>("/dashboard", {
        params: data.params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
