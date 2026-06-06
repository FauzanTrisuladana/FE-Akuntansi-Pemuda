export type AkunKeuanganStatus = "aktif" | "tidak_aktif";

export type AkunKeuanganRecord = {
  id: number;
  namaAkun: string;
  kas: string;
  jumlah: number;
  keterangan?: string | null;
  status: AkunKeuanganStatus;
};

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

export const MOCK_KAS_OPTIONS: Array<KasOption> = [
  { id: 1, nama: "17 an" },
  { id: 2, nama: "kas pemuda" },
];

export const MOCK_AKUN_KEUANGAN: Array<AkunKeuanganRecord> = [
  {
    id: 1,
    namaAkun: "Kas Modal",
    kas: "17 an",
    jumlah: 5000000,
    keterangan: "Dana awal untuk modal",
    status: "aktif",
  },
  {
    id: 2,
    namaAkun: "Kas Operasional",
    kas: "kas pemuda",
    jumlah: 2500000,
    keterangan: "Kas operasional harian",
    status: "aktif",
  },
  {
    id: 3,
    namaAkun: "Kas Lainnya",
    kas: "17 an",
    jumlah: 3000000,
    keterangan: "Kas tambahan",
    status: "aktif",
  },
];

export const MOCK_TRANSACTIONS: Record<number, Array<TransactionRecord>> = {
  1: [
    {
      id: 1,
      tanggal: "2024-01-15",
      jenisTransaksi: "Setoran",
      deskripsi: "Setoran awal modal",
      debit: 5000000,
      kredit: 0,
      saldo: 5000000,
    },
  ],
  2: [
    {
      id: 2,
      tanggal: "2024-01-16",
      jenisTransaksi: "Penjualan",
      deskripsi: "Penjualan barang",
      debit: 2500000,
      kredit: 0,
      saldo: 2500000,
    },
  ],
  3: [
    {
      id: 3,
      tanggal: "2024-01-17",
      jenisTransaksi: "Lainnya",
      deskripsi: "Kas tambahan",
      debit: 3000000,
      kredit: 0,
      saldo: 3000000,
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
