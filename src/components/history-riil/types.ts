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
export const toHistoryRiilRecord = (
  h: HistoryRiilBackend,
): HistoryRiilRecord => ({
  id: h.id,
  tanggal: h.date,
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

// Opsi Kas untuk filter
export const KAS_OPTIONS: Array<{ id: number; nama: string }> = [
  { id: 1, nama: "17 an" },
  { id: 2, nama: "kas pemuda" },
];
