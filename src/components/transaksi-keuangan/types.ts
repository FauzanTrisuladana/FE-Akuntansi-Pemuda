export type TransaksiKeuanganRecord = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun_id: number;
  akun_transaksi: string;
  penanggung_jawab_id?: number;
  penanggung_jawab: string;
  penginput: {
    nama: string;
    email: string;
    avatar?: string;
  };
  kas: string;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti?: string; // URL atau path file bukti
};

export type TransaksiKeuanganFormErrors = Partial<
  Record<string, Array<string>>
> | null;

// Backend response type
export type TransaksiBackend = {
  id: number;
  akun_id: number;
  penginput_id: number;
  penanggung_jawab_id: number;
  deskripsi: string | null;
  date: string;
  jenis_transaksi: "pemasukan" | "pengeluaran";
  jumlah: number;
  bukti: string | null;
  akun?: {
    id: number;
    nama_akun: string;
    kas: string;
    jumlah: string;
    keterangan: string | null;
  };
  penginput?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    profile_image: string | null;
    has_password: boolean;
  };
  penanggung_jawab?: {
    id: number;
    nama: string;
    valuasi_transaksi: number;
  };
};

// Convert backend to frontend format
export const toTransaksiKeuanganRecord = (
  t: TransaksiBackend,
): TransaksiKeuanganRecord => ({
  id: t.id,
  tanggal: t.date,
  deskripsi: t.deskripsi || "",
  akun_id: t.akun_id,
  akun_transaksi: t.akun?.nama_akun || "",
  penanggung_jawab_id: t.penanggung_jawab?.id,
  penanggung_jawab: t.penanggung_jawab?.nama || "",
  penginput: {
    nama: t.penginput?.name || "",
    email: t.penginput?.email || "",
    avatar: t.penginput?.profile_image || undefined,
  },
  kas: t.akun?.kas || "",
  tipe: t.jenis_transaksi,
  jumlah: t.jumlah,
  bukti: t.bukti || undefined,
});

export type AkunOption = {
  id: number;
  nama: string;
};

export type KasOption = {
  id: number;
  nama: string;
};

export type PenanggungJawabOption = {
  id: number;
  nama: string;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
