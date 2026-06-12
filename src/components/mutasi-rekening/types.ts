export type MutasiRekeningRecord = {
  id: number;
  tanggal: string;
  akun_debit: string;
  akun_kredit: string;
  akun_debit_id: number;
  akun_kredit_id: number;
  kas: string;
  jumlah: number;
  keterangan?: string | null;
};

// Backend response type
export type MutasiRekeningBackend = {
  id: number;
  akun_debit_id: number;
  akun_kredit_id: number;
  date: string;
  jumlah: number;
  keterangan: string | null;
  akun_debit?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
  akun_kredit?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
};

// Convert backend to frontend format
export const toMutasiRekeningRecord = (
  m: MutasiRekeningBackend,
): MutasiRekeningRecord => ({
  id: m.id,
  tanggal: m.date.split("T")[0] ?? m.date,
  akun_debit: m.akun_debit?.nama_akun ?? "-",
  akun_kredit: m.akun_kredit?.nama_akun ?? "-",
  akun_debit_id: m.akun_debit_id,
  akun_kredit_id: m.akun_kredit_id,
  kas: m.akun_debit?.kas ?? m.akun_kredit?.kas ?? "-",
  jumlah: m.jumlah,
  keterangan: m.keterangan,
});

export type AkunOption = {
  id: number;
  nama: string;
};

export type MutasiRekeningFormErrors = Partial<
  Record<string, Array<string>>
> | null;

export const MOCK_KAS_OPTIONS: Array<AkunOption> = [
  { id: 1, nama: "17 an" },
  { id: 2, nama: "kas pemuda" },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
