export type AkunKeuanganStatus = "aktif" | "tidak_aktif";

export type AkunKeuanganRecord = {
  id: number;
  namaAkun: string;
  kas: string;
  jumlah: number;
  keterangan?: string | null;
  status: AkunKeuanganStatus;
};

// Backend response type
export type AkunKeuanganBackend = {
  id: number;
  nama_akun: string;
  kas: string;
  jumlah: string | number;
  keterangan?: string | null;
};

// Transaction from backend
export type TransactionBackend = {
  id: number;
  akun_id: number;
  penginput_id: number;
  penanggung_jawab_id: number;
  deskripsi: string;
  date: string;
  jenis_transaksi: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti: string | null;
};

// Convert backend to frontend format
export const toAkunKeuanganRecord = (
  a: AkunKeuanganBackend,
): AkunKeuanganRecord => ({
  id: a.id,
  namaAkun: a.nama_akun,
  kas: a.kas,
  jumlah: typeof a.jumlah === "string" ? parseFloat(a.jumlah) : a.jumlah,
  keterangan: a.keterangan,
  status: "aktif",
});

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Convert backend transaction to frontend format
export const toTransactionRecord = (
  t: TransactionBackend,
): TransactionRecord => ({
  id: t.id,
  tanggal: t.date.split("T")[0] ?? t.date,
  jenisTransaksi:
    t.jenis_transaksi === "pemasukan" ? "Pemasukan" : "Pengeluaran",
  deskripsi: t.deskripsi,
  debit: t.jenis_transaksi === "pemasukan" ? t.jumlah : 0,
  kredit: t.jenis_transaksi === "pengeluaran" ? t.jumlah : 0,
  saldo: 0, // Will be calculated
});

export type KasOption = {
  id: number;
  nama: string;
};

export type AkunKeuanganFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export type TransactionRecord = {
  id: number;
  tanggal: string;
  jenisTransaksi: string;
  deskripsi: string;
  debit: number;
  kredit: number;
  saldo: number;
};
