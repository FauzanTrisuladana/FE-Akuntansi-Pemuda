// ─── Types ─────────────────────────────────────────────────────────────────────

export type LaporanKeuanganTransaksiRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun_transaksi: string;
  penanggung_jawab: string;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti?: string;
};

export type LaporanKeuanganMutasiRecord = {
  id: number;
  tanggal: string;
  akun_debit: string;
  akun_kredit: string;
  jumlah: number;
  keterangan: string;
};

export type LaporanKeuanganPosisiRecord = {
  nama_akun: string;
  saldo_awal: number;
  pemasukan: number;
  pengeluaran: number;
  total: number;
  riil: number;
  selisih: number;
  keterangan: "Seimbang" | "Uang Kurang" | "Uang Lebih";
};

export type AkunOption = {
  id: number;
  nama: string;
};

export type KasOption = {
  id: number;
  nama: string;
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
