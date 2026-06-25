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
