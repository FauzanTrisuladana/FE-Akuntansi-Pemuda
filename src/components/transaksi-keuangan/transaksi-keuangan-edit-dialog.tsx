import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type {
  TransaksiKeuanganFormErrors,
  TransaksiKeuanganRecord,
} from "./types";
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

interface TransaksiKeuanganEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TransaksiKeuanganRecord | null;
  onUpdate?: (payload: {
    id: number;
    tanggal: string;
    deskripsi: string;
    akun_transaksi: string;
    penanggung_jawab: string;
    penginput: string;
    kas: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: File | null;
  }) => Promise<boolean> | boolean;
  errors?: TransaksiKeuanganFormErrors;
  akunOptions?: Array<{ id: number; nama: string }>;
  kasOptions?: Array<{ id: number; nama: string }>;
  penginputOptions?: Array<{ id: number; nama: string; email: string }>;
  penanggungJawabOptions?: Array<{ id: number; nama: string }>;
}

export function TransaksiKeuanganEditDialog({
  open,
  onOpenChange,
  data,
  onUpdate,
  errors: _errors,
  akunOptions,
  kasOptions,
  penginputOptions,
  penanggungJawabOptions,
}: TransaksiKeuanganEditDialogProps) {
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

  useEffect(() => {
    if (data) {
      setTanggal(data.tanggal);
      setDeskripsi(data.deskripsi);
      setTipe(data.tipe);
      setKas(data.kas);
      setAkunTransaksi(data.akun_transaksi);
      setPenanggungJawab(data.penanggung_jawab);
      setPenginput(data.penginput.nama);
      setJumlah(data.jumlah.toString());
      setPreviewUrl(data.bukti);
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setIsLoading(true);
    try {
      const success = await onUpdate?.({
        id: data.id,
        tanggal,
        deskripsi,
        akun_transaksi: akunTransaksi,
        penanggung_jawab: penanggungJawab,
        penginput,
        kas,
        tipe,
        jumlah: parseFloat(jumlah),
        bukti: _buktiFile,
      });
      if (success) {
        onOpenChange(false);
      }
    } catch {
      toast.error("Gagal memperbarui transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    tanggal.trim() !== "" &&
    deskripsi.trim() !== "" &&
    akunTransaksi !== "" &&
    jumlah.trim() !== "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const tanggalError = _errors?.tanggal?.[0];
  const deskripsiError = _errors?.deskripsi?.[0];
  const jumlahError = _errors?.jumlah?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Transaksi
            </DialogTitle>
            <DialogDescription>
              Silakan ubah data transaksi keuangan
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
                {kasOptions?.map((option) => {
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

            {/* Akun Transaksi - hanya tampil jika kas sudah dipilih */}
            {kas && (
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
                    {akunOptions?.map((option) => (
                      <SelectItem key={option.id} value={option.nama}>
                        {option.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Penanggung Jawab - hanya tampil jika kas sudah dipilih */}
            {kas && (
              <div className="grid gap-2">
                <Label
                  htmlFor="penanggung-jawab"
                  className="text-slate-600 font-medium"
                >
                  Penanggung Jawab<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={penanggungJawab}
                  onValueChange={setPenanggungJawab}
                >
                  <SelectTrigger
                    id="penanggung-jawab"
                    className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Pilih Penanggung Jawab" />
                  </SelectTrigger>
                  <SelectContent>
                    {(penanggungJawabOptions ?? []).map((option) => (
                      <SelectItem key={option.id} value={option.nama}>
                        {option.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Penginput - hanya tampil jika kas sudah dipilih */}
            {kas && (
              <div className="grid gap-2">
                <Label
                  htmlFor="penginput"
                  className="text-slate-600 font-medium"
                >
                  Penginput
                </Label>
                <Select value={penginput} onValueChange={setPenginput}>
                  <SelectTrigger
                    id="penginput"
                    className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Pilih Penginput" />
                  </SelectTrigger>
                  <SelectContent>
                    {(penginputOptions ?? []).map((option) => (
                      <SelectItem key={option.id} value={option.nama}>
                        {option.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Jumlah - hanya tampil jika kas sudah dipilih */}
            {kas && (
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
            )}

            {/* Preview Bukti - hanya tampil jika kas sudah dipilih */}
            {kas && previewUrl && (
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

            {/* Upload File Bukti - hanya tampil jika kas sudah dipilih */}
            {kas && (
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
            )}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => onOpenChange(false)}
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
