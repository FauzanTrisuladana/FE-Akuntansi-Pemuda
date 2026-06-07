export type HistoryRiilRecord = {
  id: number;
  tanggal: string;
  nama_akun: string;
  kas: string;
  nilai_riil: number;
  is_verified: boolean;
};

export type HistoryRiilFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Mock data untuk History Riil (minimal 20 data)
export const MOCK_HISTORY_RIIL: Array<HistoryRiilRecord> = [
  {
    id: 1,
    tanggal: "2024-01-15",
    nama_akun: "Kas Modal",
    kas: "Kas Utama",
    nilai_riil: 500000,
    is_verified: false,
  },
  {
    id: 2,
    tanggal: "2024-01-16",
    nama_akun: "Kas Operasional",
    kas: "Kas Operasional",
    nilai_riil: 750000,
    is_verified: true,
  },
  {
    id: 3,
    tanggal: "2024-01-17",
    nama_akun: "Kas Kasbon",
    kas: "Kas Utama",
    nilai_riil: 1000000,
    is_verified: false,
  },
  {
    id: 4,
    tanggal: "2024-01-18",
    nama_akun: "Kas Serba Guna",
    kas: "Kas Khusus",
    nilai_riil: 250000,
    is_verified: true,
  },
  {
    id: 5,
    tanggal: "2024-01-19",
    nama_akun: "Kas Dana Darurat",
    kas: "Kas Utama",
    nilai_riil: 1500000,
    is_verified: false,
  },
  {
    id: 6,
    tanggal: "2024-01-20",
    nama_akun: "Kas Investasi",
    kas: "Kas Operasional",
    nilai_riil: 300000,
    is_verified: true,
  },
  {
    id: 7,
    tanggal: "2024-01-21",
    nama_akun: "Kas Pendidikan",
    kas: "Kas Khusus",
    nilai_riil: 2000000,
    is_verified: false,
  },
  {
    id: 8,
    tanggal: "2024-01-22",
    nama_akun: "Kas Kesehatan",
    kas: "Kas Utama",
    nilai_riil: 125000,
    is_verified: true,
  },
  {
    id: 9,
    tanggal: "2024-01-23",
    nama_akun: "Kas Rumahtangga",
    kas: "Kas Operasional",
    nilai_riil: 800000,
    is_verified: false,
  },
  {
    id: 10,
    tanggal: "2024-01-24",
    nama_akun: "Kas Hiburan",
    kas: "Kas Utama",
    nilai_riil: 450000,
    is_verified: true,
  },
  {
    id: 11,
    tanggal: "2024-01-25",
    nama_akun: "Kas Tabungan",
    kas: "Kas Khusus",
    nilai_riil: 600000,
    is_verified: false,
  },
  {
    id: 12,
    tanggal: "2024-01-26",
    nama_akun: "Kas Emas",
    kas: "Kas Operasional",
    nilai_riil: 900000,
    is_verified: true,
  },
  {
    id: 13,
    tanggal: "2024-01-27",
    nama_akun: "Kas Tunai",
    kas: "Kas Utama",
    nilai_riil: 1100000,
    is_verified: false,
  },
  {
    id: 14,
    tanggal: "2024-01-28",
    nama_akun: "Kas Bank BRI",
    kas: "Kas Khusus",
    nilai_riil: 400000,
    is_verified: true,
  },
  {
    id: 15,
    tanggal: "2024-01-29",
    nama_akun: "Kas Bank BCA",
    kas: "Kas Operasional",
    nilai_riil: 750000,
    is_verified: false,
  },
  {
    id: 16,
    tanggal: "2024-01-30",
    nama_akun: "Kas Bank Mandiri",
    kas: "Kas Utama",
    nilai_riil: 1250000,
    is_verified: true,
  },
  {
    id: 17,
    tanggal: "2024-02-01",
    nama_akun: "Kas Bank BNI",
    kas: "Kas Khusus",
    nilai_riil: 350000,
    is_verified: false,
  },
  {
    id: 18,
    tanggal: "2024-02-02",
    nama_akun: "Kas Bank CIMB",
    kas: "Kas Utama",
    nilai_riil: 850000,
    is_verified: true,
  },
  {
    id: 19,
    tanggal: "2024-02-03",
    nama_akun: "Kas Bank Danamon",
    kas: "Kas Operasional",
    nilai_riil: 1750000,
    is_verified: false,
  },
  {
    id: 20,
    tanggal: "2024-02-04",
    nama_akun: "Kas Bank BTN",
    kas: "Kas Khusus",
    nilai_riil: 225000,
    is_verified: true,
  },
  {
    id: 21,
    tanggal: "2024-02-05",
    nama_akun: "Kas Bank BRI Syariah",
    kas: "Kas Utama",
    nilai_riil: 950000,
    is_verified: false,
  },
  {
    id: 22,
    tanggal: "2024-02-06",
    nama_akun: "Kas Bank BCA Syariah",
    kas: "Kas Operasional",
    nilai_riil: 650000,
    is_verified: true,
  },
];

// Opsi Kas untuk filter
export const KAS_OPTIONS = [
  { value: "all", label: "Semua Kas" },
  { value: "Kas Utama", label: "Kas Utama" },
  { value: "Kas Operasional", label: "Kas Operasional" },
  { value: "Kas Khusus", label: "Kas Khusus" },
];
