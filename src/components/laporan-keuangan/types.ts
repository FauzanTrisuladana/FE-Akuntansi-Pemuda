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
  id: number;
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

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_AKUN_OPTIONS: Array<AkunOption> = [
  { id: 1, nama: "Kas Ditangan (Retail)" },
  { id: 2, nama: "Kas Modal" },
  { id: 3, nama: "Kas Operasional" },
  { id: 4, nama: "Bank BCA" },
  { id: 5, nama: "Bank Mandiri" },
];

export const MOCK_KAS_OPTIONS: Array<KasOption> = [
  { id: 1, nama: "Kas Pemuda" },
  { id: 2, nama: "17 an" },
];

export const MOCK_LAPORAN_TRANSAKSI: Array<LaporanKeuanganTransaksiRecord> = [
  {
    id: 1,
    tanggal: "2026-06-01",
    deskripsi: "Setoran awal kas",
    akun_transaksi: "Kas Ditangan (Retail)",
    penanggung_jawab: "fauzan",
    tipe: "pemasukan",
    jumlah: 500000,
    bukti: "https://placehold.co/400x300?text=Bukti+1",
  },
  {
    id: 2,
    tanggal: "2026-06-02",
    deskripsi: "Pembelian perlengkapan kantor",
    akun_transaksi: "Kas Operasional",
    penanggung_jawab: "Rizky",
    tipe: "pengeluaran",
    jumlah: 750000,
    bukti: "https://placehold.co/400x300?text=Bukti+2",
  },
  {
    id: 3,
    tanggal: "2026-06-03",
    deskripsi: "Transfer dana ke bank",
    akun_transaksi: "Bank BCA",
    penanggung_jawab: "Ahmad",
    tipe: "pengeluaran",
    jumlah: 1000000,
    bukti: "https://placehold.co/400x300?text=Bukti+3",
  },
  {
    id: 4,
    tanggal: "2026-06-04",
    deskripsi: "Setoran dari anggota",
    akun_transaksi: "Kas Modal",
    penanggung_jawab: "fauzan",
    tipe: "pemasukan",
    jumlah: 250000,
    bukti: "https://placehold.co/400x300?text=Bukti+4",
  },
  {
    id: 5,
    tanggal: "2026-06-05",
    deskripsi: "Bayar listrik",
    akun_transaksi: "Kas Operasional",
    penanggung_jawab: "Siti",
    tipe: "pengeluaran",
    jumlah: 350000,
    bukti: "https://placehold.co/400x300?text=Bukti+5",
  },
  {
    id: 6,
    tanggal: "2026-06-06",
    deskripsi: "Penjualan produk",
    akun_transaksi: "Kas Ditangan (Retail)",
    penanggung_jawab: "fauzan",
    tipe: "pemasukan",
    jumlah: 1250000,
    bukti: "https://placehold.co/400x300?text=Bukti+6",
  },
  {
    id: 7,
    tanggal: "2026-06-07",
    deskripsi: "Gaji karyawan",
    akun_transaksi: "Kas Operasional",
    penanggung_jawab: "Rizky",
    tipe: "pengeluaran",
    jumlah: 1500000,
    bukti: "https://placehold.co/400x300?text=Bukti+7",
  },
  {
    id: 8,
    tanggal: "2026-06-08",
    deskripsi: "Donasi sponsor",
    akun_transaksi: "Kas Modal",
    penanggung_jawab: "Ahmad",
    tipe: "pemasukan",
    jumlah: 2000000,
    bukti: "https://placehold.co/400x300?text=Bukti+8",
  },
];

export const MOCK_LAPORAN_MUTASI: Array<LaporanKeuanganMutasiRecord> = [
  {
    id: 1,
    tanggal: "2026-06-01",
    akun_debit: "Kas Ditangan (Retail)",
    akun_kredit: "Bank BCA",
    jumlah: 500000,
    keterangan: "Transfer awal",
  },
  {
    id: 2,
    tanggal: "2026-06-03",
    akun_debit: "Kas Operasional",
    akun_kredit: "Kas Modal",
    jumlah: 750000,
    keterangan: "Pembagian kas",
  },
  {
    id: 3,
    tanggal: "2026-06-05",
    akun_debit: "Bank Mandiri",
    akun_kredit: "Kas Ditangan (Retail)",
    jumlah: 1000000,
    keterangan: "Withdrawal",
  },
];

export const MOCK_LAPORAN_POSISI: Array<LaporanKeuanganPosisiRecord> = [
  {
    id: 1,
    nama_akun: "Kas Ditangan (Retail)",
    saldo_awal: 1000000,
    pemasukan: 500000,
    pengeluaran: 350000,
    total: 1150000,
    riil: 1150000,
    selisih: 0,
    keterangan: "Seimbang",
  },
  {
    id: 2,
    nama_akun: "Kas Modal",
    saldo_awal: 2000000,
    pemasukan: 2250000,
    pengeluaran: 750000,
    total: 2500000,
    riil: 2400000,
    selisih: 100000,
    keterangan: "Uang Lebih",
  },
  {
    id: 3,
    nama_akun: "Kas Operasional",
    saldo_awal: 500000,
    pemasukan: 0,
    pengeluaran: 2100000,
    total: 2600000,
    riil: 2500000,
    selisih: 100000,
    keterangan: "Uang Kurang",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
