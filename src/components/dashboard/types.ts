export type DashboardStats = {
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

// Mock data untuk summary cards
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  pemasukan: { total: 15000000, change: 12.5 },
  pengeluaran: { total: 8500000, change: -8.3 },
  totalSaldo: { total: 6500000 },
};

// Mock data untuk grafik Tren Saldo Kas Bulanan (Line Chart)
export const MOCK_SALDO_HARIAN: Array<SaldoHarian> = [
  { tanggal: "2026-06-01", pemasukan: 500000, pengeluaran: 300000 },
  { tanggal: "2026-06-02", pemasukan: 750000, pengeluaran: 450000 },
  { tanggal: "2026-06-03", pemasukan: 600000, pengeluaran: 550000 },
  { tanggal: "2026-06-04", pemasukan: 800000, pengeluaran: 400000 },
  { tanggal: "2026-06-05", pemasukan: 900000, pengeluaran: 600000 },
  { tanggal: "2026-06-06", pemasukan: 700000, pengeluaran: 500000 },
  { tanggal: "2026-06-07", pemasukan: 850000, pengeluaran: 450000 },
  { tanggal: "2026-06-08", pemasukan: 950000, pengeluaran: 550000 },
];

// Mock data untuk grafik Perbandingan Pemasukan & Pengeluaran Per Minggu (Bar Chart)
export const MOCK_WEEKLY_CASHFLOW: Array<SaldoHarian> = [
  { tanggal: "Senin", pemasukan: 2500000, pengeluaran: 1800000 },
  { tanggal: "Selasa", pemasukan: 3200000, pengeluaran: 2100000 },
  { tanggal: "Rabu", pemasukan: 2800000, pengeluaran: 1900000 },
  { tanggal: "Kamis", pemasukan: 3500000, pengeluaran: 2400000 },
  { tanggal: "Jumat", pemasukan: 4200000, pengeluaran: 2800000 },
  { tanggal: "Sabtu", pemasukan: 3800000, pengeluaran: 2600000 },
  { tanggal: "Minggu", pemasukan: 3100000, pengeluaran: 2200000 },
];

// Mock data untuk grafik Tren Pertumbuhan Saldo per Jenis Akun (Multi-Line Chart)
export const MOCK_SALDO_PER_AKUN: Array<SaldoPerAkun> = [
  {
    tanggal: "2026-06-01",
    kasDitangan: 2000000,
    kasModal: 1500000,
    kasOperasional: 1000000,
    bankBca: 3000000,
    bankMandiri: 2500000,
  },
  {
    tanggal: "2026-06-02",
    kasDitangan: 2200000,
    kasModal: 1650000,
    kasOperasional: 1100000,
    bankBca: 3200000,
    bankMandiri: 2600000,
  },
  {
    tanggal: "2026-06-03",
    kasDitangan: 2100000,
    kasModal: 1700000,
    kasOperasional: 1200000,
    bankBca: 3100000,
    bankMandiri: 2550000,
  },
  {
    tanggal: "2026-06-04",
    kasDitangan: 2400000,
    kasModal: 1800000,
    kasOperasional: 1300000,
    bankBca: 3400000,
    bankMandiri: 2700000,
  },
  {
    tanggal: "2026-06-05",
    kasDitangan: 2300000,
    kasModal: 1900000,
    kasOperasional: 1250000,
    bankBca: 3300000,
    bankMandiri: 2650000,
  },
  {
    tanggal: "2026-06-06",
    kasDitangan: 2500000,
    kasModal: 2000000,
    kasOperasional: 1400000,
    bankBca: 3500000,
    bankMandiri: 2800000,
  },
  {
    tanggal: "2026-06-07",
    kasDitangan: 2600000,
    kasModal: 2100000,
    kasOperasional: 1500000,
    bankBca: 3600000,
    bankMandiri: 2900000,
  },
  {
    tanggal: "2026-06-08",
    kasDitangan: 2700000,
    kasModal: 2200000,
    kasOperasional: 1600000,
    bankBca: 3700000,
    bankMandiri: 3000000,
  },
];

// Mock data untuk grafik Rekonsiliasi Kas (Multi-Bar Chart)
export const MOCK_REKONSIALIASI: Array<RekonsiliasiData> = [
  { tanggal: "2026-06-01", sistem: 2000000, riil: 2000000, verified: true },
  { tanggal: "2026-06-02", sistem: 2200000, riil: 2150000, verified: false },
  { tanggal: "2026-06-03", sistem: 2100000, riil: 2100000, verified: true },
  { tanggal: "2026-06-04", sistem: 2400000, riil: 2350000, verified: false },
  { tanggal: "2026-06-05", sistem: 2300000, riil: 2300000, verified: true },
  { tanggal: "2026-06-06", sistem: 2500000, riil: 2500000, verified: true },
  { tanggal: "2026-06-07", sistem: 2600000, riil: 2550000, verified: false },
  { tanggal: "2026-06-08", sistem: 2700000, riil: 2700000, verified: true },
];
