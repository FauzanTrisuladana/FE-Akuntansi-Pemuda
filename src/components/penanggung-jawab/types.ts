export type PenanggungJawabRecord = {
  id: number;
  nama: string;
  valuasi: number;
};

export type TransactionPJRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun: string;
  pemasukan: number;
  pengeluaran: number;
};

export type PenanggungJawabFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export const MOCK_PENANGGUNG_JAWAB: Array<PenanggungJawabRecord> = [
  {
    id: 1,
    nama: "Fauzan",
    valuasi: 15000000,
  },
  {
    id: 2,
    nama: "Rizky",
    valuasi: 12500000,
  },
  {
    id: 3,
    nama: "Ahmad",
    valuasi: 8000000,
  },
  {
    id: 4,
    nama: "Budi",
    valuasi: 5000000,
  },
  {
    id: 5,
    nama: "Siti",
    valuasi: 3000000,
  },
  {
    id: 6,
    nama: "Dewi",
    valuasi: 2500000,
  },
  {
    id: 7,
    nama: "Agus",
    valuasi: 1000000,
  },
  {
    id: 8,
    nama: "Rina",
    valuasi: 750000,
  },
  {
    id: 9,
    nama: "Tono",
    valuasi: 500000,
  },
  {
    id: 10,
    nama: "Lisa",
    valuasi: 250000,
  },
  {
    id: 11,
    nama: "Eka",
    valuasi: 100000,
  },
  {
    id: 12,
    nama: "Joko",
    valuasi: 50000,
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
