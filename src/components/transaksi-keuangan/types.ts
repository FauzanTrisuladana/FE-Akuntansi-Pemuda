export type TransaksiKeuanganRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun_transaksi: string;
  penanggung_jawab: string;
  penginput: {
    nama: string;
    email: string;
    avatar?: string;
  };
  kas: string;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti?: string; // URL atau path file bukti
};

export type TransaksiKeuanganFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export type AkunOption = {
  id: number;
  nama: string;
};

export type KasOption = {
  id: number;
  nama: string;
};

export type PenanggungJawabOption = {
  id: number;
  nama: string;
};

export type KaryawanOption = {
  id: number;
  nama: string;
  email: string;
};

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

export const MOCK_PENANGGUNG_JAWAB_OPTIONS: Array<PenanggungJawabOption> = [
  { id: 1, nama: "fauzan" },
  { id: 2, nama: "Rizky" },
  { id: 3, nama: "Ahmad" },
  { id: 4, nama: "Budi" },
  { id: 5, nama: "Siti" },
];

export const MOCK_KARYAWAN_OPTIONS: Array<KaryawanOption> = [
  { id: 1, nama: "Alice Smith", email: "alicesmith" },
  { id: 2, nama: "Bob Johnson", email: "bobjohnson" },
  { id: 3, nama: "Carol Williams", email: "carolwilliams" },
  { id: 4, nama: "David Brown", email: "davidbrown" },
  { id: 5, nama: "Eve Davis", email: "evedavis" },
];

export const MOCK_TRANSAKSI_KEUANGAN: Array<TransaksiKeuanganRecord> = [
  {
    id: 1,
    tanggal: "2026-06-01",
    deskripsi: "Setoran awal kas",
    akun_transaksi: "Kas Ditangan (Retail)",
    penanggung_jawab: "fauzan",
    penginput: { nama: "Alice Smith", email: "alicesmith" },
    kas: "Kas Pemuda",
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
    penginput: { nama: "Bob Johnson", email: "bobjohnson" },
    kas: "17 an",
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
    penginput: { nama: "Carol Williams", email: "carolwilliams" },
    kas: "Kas Pemuda",
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
    penginput: { nama: "David Brown", email: "davidbrown" },
    kas: "17 an",
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
    penginput: { nama: "Eve Davis", email: "evedavis" },
    kas: "Kas Pemuda",
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
    penginput: { nama: "Alice Smith", email: "alicesmith" },
    kas: "17 an",
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
    penginput: { nama: "Bob Johnson", email: "bobjohnson" },
    kas: "Kas Pemuda",
    tipe: "pengeluaran",
    jumlah: 2000000,
    bukti: "https://placehold.co/400x300?text=Bukti+7",
  },
  {
    id: 8,
    tanggal: "2026-06-08",
    deskripsi: "Donasi dari sponsor",
    akun_transaksi: "Kas Modal",
    penanggung_jawab: "Ahmad",
    penginput: { nama: "Carol Williams", email: "carolwilliams" },
    kas: "17 an",
    tipe: "pemasukan",
    jumlah: 3000000,
    bukti: "https://placehold.co/400x300?text=Bukti+8",
  },
  {
    id: 9,
    tanggal: "2026-06-09",
    deskripsi: "Beli bahan baku",
    akun_transaksi: "Kas Ditangan (Retail)",
    penanggung_jawab: "Budi",
    penginput: { nama: "David Brown", email: "davidbrown" },
    kas: "Kas Pemuda",
    tipe: "pengeluaran",
    jumlah: 800000,
    bukti: "https://placehold.co/400x300?text=Bukti+9",
  },
  {
    id: 10,
    tanggal: "2026-06-10",
    deskripsi: "Penjualan tunai",
    akun_transaksi: "Kas Ditangan (Retail)",
    penanggung_jawab: "Siti",
    penginput: { nama: "Eve Davis", email: "evedavis" },
    kas: "17 an",
    tipe: "pemasukan",
    jumlah: 650000,
    bukti: "https://placehold.co/400x300?text=Bukti+10",
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
