export type PenanggungJawabRecord = {
  id: number;
  nama: string;
  valuasi_transaksi: number;
};

export type TransactionPJRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun: string;
  pemasukan: number;
  pengeluaran: number;
};

// Helper to format date from ISO to YYYY-MM-DD
const formatDate = (dateString: string): string => {
  return dateString.split("T")[0] ?? dateString;
};

// Convert backend transaction to frontend format
export const toTransactionPJRecord = (
  t: {
    id: number;
    akun_id: number;
    penginput_id: number;
    penanggung_jawab_id: number;
    deskripsi: string;
    date: string;
    jenis_transaksi: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti: string | null;
    akun?: { id: number; nama: string };
  },
): TransactionPJRecord => ({
  id: t.id,
  tanggal: formatDate(t.date),
  deskripsi: t.deskripsi,
  akun: t.akun?.nama ?? "-",
  pemasukan: t.jenis_transaksi === "pemasukan" ? t.jumlah : 0,
  pengeluaran: t.jenis_transaksi === "pengeluaran" ? t.jumlah : 0,
});

export type PenanggungJawabFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export const MOCK_PENANGGUNG_JAWAB: Array<PenanggungJawabRecord> = [
  {
    id: 1,
    nama: "Fauzan",
    valuasi_transaksi: 15000000,
  },
  {
    id: 2,
    nama: "Rizky",
    valuasi_transaksi: 12500000,
  },
  {
    id: 3,
    nama: "Ahmad",
    valuasi_transaksi: 8000000,
  },
  {
    id: 4,
    nama: "Budi",
    valuasi_transaksi: 5000000,
  },
  {
    id: 5,
    nama: "Siti",
    valuasi_transaksi: 3000000,
  },
  {
    id: 6,
    nama: "Dewi",
    valuasi_transaksi: 2500000,
  },
  {
    id: 7,
    nama: "Agus",
    valuasi_transaksi: 1000000,
  },
  {
    id: 8,
    nama: "Rina",
    valuasi_transaksi: 750000,
  },
  {
    id: 9,
    nama: "Tono",
    valuasi_transaksi: 500000,
  },
  {
    id: 10,
    nama: "Lisa",
    valuasi_transaksi: 250000,
  },
  {
    id: 11,
    nama: "Eka",
    valuasi_transaksi: 100000,
  },
  {
    id: 12,
    nama: "Joko",
    valuasi_transaksi: 50000,
  },
];

export const MOCK_TRANSACTIONS_PJ: Record<
  number,
  Array<TransactionPJRecord>
> = {
  1: [
    {
      id: 1,
      tanggal: "2024-01-15",
      deskripsi: "Setoran awal",
      akun: "Kas Modal",
      pemasukan: 5000000,
      pengeluaran: 0,
    },
    {
      id: 2,
      tanggal: "2024-01-20",
      deskripsi: "Penjualan barang",
      akun: "Kas Operasional",
      pemasukan: 10000000,
      pengeluaran: 0,
    },
  ],
  2: [
    {
      id: 3,
      tanggal: "2024-01-16",
      deskripsi: "Setoran rutin",
      akun: "Kas Operasional",
      pemasukan: 5000000,
      pengeluaran: 0,
    },
  ],
  3: [
    {
      id: 4,
      tanggal: "2024-01-17",
      deskripsi: "Dana hibah",
      akun: "Kas Lainnya",
      pemasukan: 8000000,
      pengeluaran: 0,
    },
  ],
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
