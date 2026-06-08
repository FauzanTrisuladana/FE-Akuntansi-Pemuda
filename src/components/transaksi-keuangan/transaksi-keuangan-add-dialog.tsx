import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { TransaksiKeuanganFormErrors } from "./types";
import { MOCK_KARYAWAN_OPTIONS } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────
type TransaksiKeuanganAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (payload: {
    tanggal: string;
    deskripsi: string;
    akun_transaksi: string;
    penanggung_jawab: string;
    penginput: string;
    kas: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: string;
  }) => boolean;
  errors?: TransaksiKeuanganFormErrors;
  akunOptions: Array<{ id: number; nama: string }>;
  kasOptions: Array<{ id: number; nama: string }>;
  penginputOptions?: Array<{ id: number; nama: string; email: string }>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function TransaksiKeuanganAddDialog({
  open,
  onOpenChange,
  onCreate,
  errors: _errors,
  akunOptions,
  kasOptions,
  penginputOptions,
}: TransaksiKeuanganAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled
    ? (onOpenChange as (o: boolean) => void)
    : setInternalOpen;

  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tipe, setTipe] = useState<"pemasukan" | "pengeluaran">("pemasukan");
  const [kas, setKas] = useState("");
  const [akunTransaksi, setAkunTransaksi] = useState("");
  const [penanggungJawab, setPenanggungJawab] = useState("");
  const [penginput, setPenginput] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [_buktiFile, setBuktiFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    tanggal.trim() !== "" &&
    deskripsi.trim() !== "" &&
    akunTransaksi !== "" &&
    jumlah.trim() !== "";

  const resetForm = () => {
    setTanggal("");
    setDeskripsi("");
    setTipe("pemasukan");
    setKas("");
    setAkunTransaksi("");
    setPenanggungJawab("");
    setPenginput("");
    setJumlah("");
    setBuktiFile(null);
    setPreviewUrl(undefined);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const success = await onCreate({
        tanggal: tanggal.trim(),
        deskripsi: deskripsi.trim(),
        akun_transaksi: akunTransaksi,
        penanggung_jawab: penanggungJawab,
        penginput,
        kas,
        tipe,
        jumlah: parseFloat(jumlah),
        bukti: previewUrlString,
      });
      if (success) {
        setDialogOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Gagal membuat transaksi baru");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    setDialogOpen(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Keep previewUrl as string | undefined for type compatibility
  const previewUrlString = previewUrl ?? undefined;

  const generalError = _errors?.general?.[0];
  const tanggalError = _errors?.tanggal?.[0];
  const deskripsiError = _errors?.deskripsi?.[0];
  const jumlahError = _errors?.jumlah?.[0];

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Lakukan Transaksi
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan transaksi keuangan baru
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Deskripsi */}
            <div className="grid gap-2">
              <Label htmlFor="deskripsi" className="text-slate-600 font-medium">
                Deskripsi<span className="text-red-500">*</span>
              </Label>
              <Input
                id="deskripsi"
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi"
                className="h-12"
                disabled={isLoading}
              />
              {deskripsiError ? (
                <p className="text-sm text-destructive">{deskripsiError}</p>
              ) : null}
            </div>

            {/* Tanggal */}
            <div className="grid gap-2">
              <Label htmlFor="tanggal" className="text-slate-600 font-medium">
                Tanggal<span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="h-12"
                disabled={isLoading}
              />
              {tanggalError ? (
                <p className="text-sm text-destructive">{tanggalError}</p>
              ) : null}
            </div>

            {/* Tipe Transaksi */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">
                Tipe Transaksi<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-3">
                {(["pemasukan", "pengeluaran"] as const).map((t) => {
                  const isSelected = tipe === t;
                  return (
                    <Badge
                      key={t}
                      variant="outline"
                      className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                        isSelected
                          ? t === "pemasukan"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                      onClick={() => setTipe(t)}
                    >
                      {t === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Kas Keuangan */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">
                Kas Keuangan<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-3">
                {kasOptions.map((option) => {
                  const isSelected = kas === option.nama;
                  return (
                    <Badge
                      key={option.id}
                      variant="outline"
                      className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                        isSelected
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                      onClick={() => setKas(option.nama)}
                    >
                      {option.nama}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Akun Transaksi */}
            <div className="grid gap-2">
              <Label htmlFor="akun" className="text-slate-600 font-medium">
                Akun Transaksi<span className="text-red-500">*</span>
              </Label>
              <Select value={akunTransaksi} onValueChange={setAkunTransaksi}>
                <SelectTrigger
                  id="akun"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                  disabled={isLoading}
                >
                  <SelectValue placeholder="Pilih Akun Transaksi" />
                </SelectTrigger>
                <SelectContent>
                  {akunOptions.map((option) => (
                    <SelectItem key={option.id} value={option.nama}>
                      {option.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Penginput */}
            <div className="grid gap-2">
              <Label htmlFor="penginput" className="text-slate-600 font-medium">
                Penginput
              </Label>
              <Select
                value={penginput}
                onValueChange={setPenginput}
              >
                <SelectTrigger
                  id="penginput"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                  disabled={isLoading}
                >
                  <SelectValue placeholder="Pilih Penginput" />
                </SelectTrigger>
                <SelectContent>
                  {(penginputOptions ?? MOCK_KARYAWAN_OPTIONS).map((option) => (
                    <SelectItem key={option.id} value={option.nama}>
                      {option.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jumlah */}
            <div className="grid gap-2">
              <Label htmlFor="jumlah" className="text-slate-600 font-medium">
                Jumlah<span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlah"
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Masukkan jumlah"
                className="h-12"
                disabled={isLoading}
              />
              {jumlahError ? (
                <p className="text-sm text-destructive">{jumlahError}</p>
              ) : null}
            </div>

            {/* Preview Bukti */}
            {previewUrl && (
              <div className="grid gap-2">
                <Label className="text-slate-600 font-medium">
                  Preview Bukti
                </Label>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                  <img
                    src={previewUrl}
                    alt="Preview bukti"
                    className="max-h-40 w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Upload File Bukti */}
            <div className="grid gap-2">
              <Label htmlFor="bukti" className="text-slate-600 font-medium">
                File Bukti
              </Label>
              <Input
                id="bukti"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-12"
                disabled={isLoading}
              />
            </div>

            {generalError ? (
              <p className="text-sm text-destructive">{generalError}</p>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
