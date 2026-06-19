import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type LaporanTransaksiRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun_transaksi: string;
  penanggung_jawab: string;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti?: string;
};

export type LaporanMutasiRecord = {
  id: number;
  tanggal: string;
  akun_debit: string;
  akun_kredit: string;
  jumlah: number;
  keterangan: string;
};

export type LaporanPosisiRecord = {
  nama_akun: string;
  saldo_awal: number;
  pemasukan: number;
  pengeluaran: number;
  total: number;
  riil: number;
  selisih: number;
  keterangan: "Seimbang" | "Uang Kurang" | "Uang Lebih";
};

export type LaporanResponse = {
  status: string;
  message: string;
  data: {
    transaksi: Array<LaporanTransaksiRecord>;
    mutasi: Array<LaporanMutasiRecord>;
    posisi_keuangan: Array<LaporanPosisiRecord>;
  };
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo_awal: number;
    kas_sekarang: number;
  };
};

export type IndexLaporanParams = {
  tanggal_mulai: string;
  tanggal_selesai: string;
  jenis_transaksi: Array<"pemasukan" | "pengeluaran">;
  kas: string;
  akun?: number | null;
};

// Get laporan keuangan
export const getLaporanKeuangan = createServerFn({ method: "GET" })
  .validator((data: { params: IndexLaporanParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<{
        status: string;
        message: string;
        data: {
          transaksi: Array<{
            id: number;
            date: string;
            deskripsi: string | null;
            jenis_transaksi: "pemasukan" | "pengeluaran";
            jumlah: number;
            bukti: string | null;
            akun?: { nama_akun: string };
            penanggung_jawab?: { nama: string };
          }>;
          mutasi: Array<{
            id: number;
            date: string;
            jumlah: number;
            keterangan: string;
            akun_debit?: { nama_akun: string };
            akun_kredit?: { nama_akun: string };
          }>;
          posisi_keuangan: Array<{
            nama_akun: string;
            saldo_awal: number;
            pemasukan: number;
            pengeluaran: number;
            total: number;
            riil: number;
            selisih: number;
            keterangan: string;
          }>;
        };
        summary: {
          total_pemasukan: string;
          total_pengeluaran: string;
          saldo_awal: number;
          kas_sekarang: number;
        };
      }>("/laporan", {
        params: data.params,
      });

      // Map backend data to frontend format
      const mappedData = {
        transaksi: mapTransaksiToLaporan(response.data.data.transaksi),
        mutasi: mapMutasiToLaporan(response.data.data.mutasi),
        posisi_keuangan: mapPosisiToLaporan(response.data.data.posisi_keuangan),
      };

      return {
        status: response.data.status,
        message: response.data.message,
        data: mappedData,
        summary: {
          total_pemasukan: parseFloat(response.data.summary.total_pemasukan),
          total_pengeluaran: parseFloat(
            response.data.summary.total_pengeluaran,
          ),
          saldo_awal: response.data.summary.saldo_awal,
          kas_sekarang: response.data.summary.kas_sekarang,
        },
      };
    } catch (error) {
      handleApiError(error);
    }
  });

// Helper to map backend transaksi to frontend format
export const mapTransaksiToLaporan = (
  transaksi: Array<{
    id: number;
    date: string;
    deskripsi: string | null;
    jenis_transaksi: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti: string | null;
    akun?: { nama_akun: string };
    penanggung_jawab?: { nama: string };
  }>,
): Array<LaporanTransaksiRecord> => {
  return transaksi.map((t) => ({
    id: t.id,
    tanggal: t.date,
    deskripsi: t.deskripsi ?? "",
    akun_transaksi: t.akun?.nama_akun ?? "",
    penanggung_jawab: t.penanggung_jawab?.nama ?? "",
    tipe: t.jenis_transaksi,
    jumlah: t.jumlah,
    bukti: t.bukti ?? undefined,
  }));
};

// Helper to map backend mutasi to frontend format
export const mapMutasiToLaporan = (
  mutasi: Array<{
    id: number;
    date: string;
    jumlah: number;
    keterangan: string;
    akun_debit?: { nama_akun: string };
    akun_kredit?: { nama_akun: string };
  }>,
): Array<LaporanMutasiRecord> => {
  return mutasi.map((m) => ({
    id: m.id,
    tanggal: m.date,
    akun_debit: m.akun_debit?.nama_akun ?? "",
    akun_kredit: m.akun_kredit?.nama_akun ?? "",
    jumlah: m.jumlah,
    keterangan: m.keterangan,
  }));
};

// Helper to map backend posisi to frontend format
export const mapPosisiToLaporan = (
  posisi: Array<{
    nama_akun: string;
    saldo_awal: number;
    pemasukan: number;
    pengeluaran: number;
    total: number;
    riil: number;
    selisih: number;
    keterangan: string;
  }>,
): Array<LaporanPosisiRecord> => {
  return posisi.map((p) => ({
    nama_akun: p.nama_akun,
    saldo_awal: p.saldo_awal,
    pemasukan: p.pemasukan,
    pengeluaran: p.pengeluaran,
    total: p.total,
    riil: p.riil,
    selisih: p.selisih,
    keterangan: p.keterangan as "Seimbang" | "Uang Kurang" | "Uang Lebih",
  }));
};
