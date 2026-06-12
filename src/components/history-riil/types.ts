export type HistoryRiilRecord = {
  id: number;
  tanggal: string;
  nama_akun: string;
  kas: string;
  nilai_riil: number;
  is_verified: boolean;
};

// Backend response type
export type HistoryRiilBackend = {
  id: number;
  date: string;
  verified: boolean;
  riil: string;
  akun?: {
    id: number;
    nama_akun: string;
    kas: string;
    keterangan: string | null;
  };
};

// Convert backend to frontend format
export const toHistoryRiilRecord = (h: HistoryRiilBackend): HistoryRiilRecord => ({
  id: h.id,
  tanggal: h.date.split("T")[0] ?? h.date,
  nama_akun: h.akun?.nama_akun ?? "-",
  kas: h.akun?.kas ?? "-",
  nilai_riil: parseFloat(h.riil),
  is_verified: h.verified,
});

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
    tanggal: "2026-06-01",
    nama_akun: "Kas Modal",
    kas: "17 an",
    nilai_riil: 500000,
    is_verified: false,
  },
  {
    id: 2,
    tanggal: "2026-06-02",
    nama_akun: "Kas Operasional",
    kas: "kas pemuda",
    nilai_riil: 750000,
    is_verified: true,
  },
  {
    id: 3,
    tanggal: "2026-06-03",
    nama_akun: "Kas Kasbon",
    kas: "17 an",
    nilai_riil: 1000000,
    is_verified: false,
  },
  {
    id: 4,
    tanggal: "2026-06-04",
    nama_akun: "Kas Serba Guna",
    kas: "kas pemuda",
    nilai_riil: 250000,
    is_verified: true,
  },
  {
    id: 5,
    tanggal: "2026-06-05",
    nama_akun: "Kas Dana Darurat",
    kas: "17 an",
    nilai_riil: 1500000,
    is_verified: false,
  },
  {
    id: 6,
    tanggal: "2026-06-06",
    nama_akun: "Kas Investasi",
    kas: "kas pemuda",
    nilai_riil: 300000,
    is_verified: true,
  },
  {
    id: 7,
    tanggal: "2026-06-07",
    nama_akun: "Kas Pendidikan",
    kas: "17 an",
    nilai_riil: 2000000,
    is_verified: false,
  },
  {
    id: 8,
    tanggal: "2026-06-08",
    nama_akun: "Kas Kesehatan",
    kas: "kas pemuda",
    nilai_riil: 125000,
    is_verified: true,
  },
  {
    id: 9,
    tanggal: "2026-06-09",
    nama_akun: "Kas Rumahtangga",
    kas: "17 an",
    nilai_riil: 800000,
    is_verified: false,
  },
  {
    id: 10,
    tanggal: "2026-06-10",
    nama_akun: "Kas Hiburan",
    kas: "kas pemuda",
    nilai_riil: 450000,
    is_verified: true,
  },
  {
    id: 11,
    tanggal: "2026-06-11",
    nama_akun: "Kas Tabungan",
    kas: "17 an",
    nilai_riil: 600000,
    is_verified: false,
  },
  {
    id: 12,
    tanggal: "2026-06-12",
    nama_akun: "Kas Emas",
    kas: "kas pemuda",
    nilai_riil: 900000,
    is_verified: true,
  },
  {
    id: 13,
    tanggal: "2026-06-13",
    nama_akun: "Kas Tunai",
    kas: "17 an",
    nilai_riil: 1100000,
    is_verified: false,
  },
  {
    id: 14,
    tanggal: "2026-06-14",
    nama_akun: "Kas Bank BRI",
    kas: "kas pemuda",
    nilai_riil: 400000,
    is_verified: true,
  },
  {
    id: 15,
    tanggal: "2026-06-15",
    nama_akun: "Kas Bank BCA",
    kas: "17 an",
    nilai_riil: 750000,
    is_verified: false,
  },
  {
    id: 16,
    tanggal: "2026-06-16",
    nama_akun: "Kas Bank Mandiri",
    kas: "kas pemuda",
    nilai_riil: 1250000,
    is_verified: true,
  },
  {
    id: 17,
    tanggal: "2026-06-17",
    nama_akun: "Kas Bank BNI",
    kas: "17 an",
    nilai_riil: 350000,
    is_verified: false,
  },
  {
    id: 18,
    tanggal: "2026-06-18",
    nama_akun: "Kas Bank CIMB",
    kas: "kas pemuda",
    nilai_riil: 850000,
    is_verified: true,
  },
  {
    id: 19,
    tanggal: "2026-06-19",
    nama_akun: "Kas Bank Danamon",
    kas: "17 an",
    nilai_riil: 1750000,
    is_verified: false,
  },
  {
    id: 20,
    tanggal: "2026-06-20",
    nama_akun: "Kas Bank BTN",
    kas: "kas pemuda",
    nilai_riil: 225000,
    is_verified: true,
  },
  {
    id: 21,
    tanggal: "2026-06-21",
    nama_akun: "Kas Bank BRI Syariah",
    kas: "17 an",
    nilai_riil: 950000,
    is_verified: false,
  },
  {
    id: 22,
    tanggal: "2026-06-22",
    nama_akun: "Kas Bank BCA Syariah",
    kas: "kas pemuda",
    nilai_riil: 650000,
    is_verified: true,
  },
];

// Opsi Kas untuk filter
export const KAS_OPTIONS: Array<{ id: number; nama: string }> = [
  { id: 1, nama: "17 an" },
  { id: 2, nama: "kas pemuda" },
];
