export type MutasiRekeningRecord = {
  id: number;
  tanggal: string;
  akun_debit: string;
  akun_kredit: string;
  kas: string;
  jumlah: number;
  keterangan?: string | null;
};

export type AkunOption = {
  id: number;
  nama: string;
};

export type MutasiRekeningFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export const MOCK_AKUN_OPTIONS: Array<AkunOption> = [
  { id: 1, nama: "Kas Modal" },
  { id: 2, nama: "Kas Operasional" },
  { id: 3, nama: "Kas Lainnya" },
  { id: 4, nama: "Bank BCA" },
  { id: 5, nama: "Bank Mandiri" },
];

export const MOCK_KAS_OPTIONS: Array<AkunOption> = [
  { id: 1, nama: "17 an" },
  { id: 2, nama: "kas pemuda" },
];

export const MOCK_MUTASI_REKENING: Array<MutasiRekeningRecord> = [
  {
    id: 1,
    tanggal: "2026-06-01",
    akun_debit: "Kas Operasional",
    akun_kredit: "Kas Modal",
    kas: "17 an",
    jumlah: 1000000,
    keterangan: "Transfer dana untuk operasional",
  },
  {
    id: 2,
    tanggal: "2026-06-02",
    akun_debit: "Bank BCA",
    akun_kredit: "Kas Operasional",
    kas: "kas pemuda",
    jumlah: 500000,
    keterangan: "Setoran bank",
  },
  {
    id: 3,
    tanggal: "2026-06-03",
    akun_debit: "Kas Modal",
    akun_kredit: "Bank Mandiri",
    kas: "17 an",
    jumlah: 2000000,
    keterangan: "Transfer ke bank",
  },
  {
    id: 4,
    tanggal: "2026-06-04",
    akun_debit: "Kas Lainnya",
    akun_kredit: "Kas Operasional",
    kas: "kas pemuda",
    jumlah: 750000,
    keterangan: "Dana tambahan",
  },
  {
    id: 5,
    tanggal: "2026-06-05",
    akun_debit: "Bank BCA",
    akun_kredit: "Kas Modal",
    kas: "17 an",
    jumlah: 1500000,
    keterangan: "Transfer modal",
  },
  {
    id: 6,
    tanggal: "2026-06-06",
    akun_debit: "Kas Operasional",
    akun_kredit: "Kas Lainnya",
    kas: "kas pemuda",
    jumlah: 300000,
    keterangan: "Penyesuaian kas",
  },
  {
    id: 7,
    tanggal: "2026-06-07",
    akun_debit: "Bank Mandiri",
    akun_kredit: "Bank BCA",
    kas: "17 an",
    jumlah: 2500000,
    keterangan: "Transfer antar bank",
  },
  {
    id: 8,
    tanggal: "2026-06-08",
    akun_debit: "Kas Modal",
    akun_kredit: "Kas Operasional",
    kas: "kas pemuda",
    jumlah: 1000000,
    keterangan: "Dana operasional",
  },
  {
    id: 9,
    tanggal: "2026-06-09",
    akun_debit: "Kas Lainnya",
    akun_kredit: "Bank Mandiri",
    kas: "17 an",
    jumlah: 400000,
    keterangan: "Transfer tunai",
  },
  {
    id: 10,
    tanggal: "2026-06-10",
    akun_debit: "Bank BCA",
    akun_kredit: "Kas Lainnya",
    kas: "kas pemuda",
    jumlah: 600000,
    keterangan: "Setoran tambahan",
  },
  {
    id: 11,
    tanggal: "2026-06-11",
    akun_debit: "Kas Operasional",
    akun_kredit: "Bank BCA",
    kas: "17 an",
    jumlah: 800000,
    keterangan: "Transfer keluar",
  },
  {
    id: 12,
    tanggal: "2026-06-12",
    akun_debit: "Kas Modal",
    akun_kredit: "Kas Lainnya",
    kas: "kas pemuda",
    jumlah: 1200000,
    keterangan: "Redistribusi dana",
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
