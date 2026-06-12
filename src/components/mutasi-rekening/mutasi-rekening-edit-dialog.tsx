import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { MutasiRekeningFormErrors, MutasiRekeningRecord } from "./types";
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

interface MutasiRekeningEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: MutasiRekeningRecord | null;
  onUpdate?: (payload: {
    id: number;
    tanggal: string;
    akunDebit: string;
    akunKredit: string;
    jumlah: number;
    keterangan?: string;
    kas: string;
  }) => boolean;
  errors?: MutasiRekeningFormErrors;
  akunOptions?: Array<{ id: number; nama: string }>;
}

export function MutasiRekeningEditDialog({
  open,
  onOpenChange,
  data,
  onUpdate,
  errors: _errors,
  akunOptions: _akunOptions,
}: MutasiRekeningEditDialogProps) {
  const [tanggal, setTanggal] = useState("");
  const [kas, setKas] = useState(data?.kas ?? "");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setTanggal(data.tanggal);
      setKas(data.kas);
      setJumlah(data.jumlah.toString());
      setKeterangan(data.keterangan ?? "");
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
        akunDebit: data.akun_debit,
        akunKredit: data.akun_kredit,
        jumlah: parseFloat(jumlah),
        keterangan: keterangan.trim() || undefined,
        kas,
      });
      if (success) {
        onOpenChange(false);
      }
    } catch {
      toast.error("Gagal memperbarui mutasi akun");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = tanggal.trim() !== "" && jumlah.trim() !== "";

  const generalError = _errors?.general?.[0];
  const tanggalError = _errors?.tanggal?.[0];
  const jumlahError = _errors?.jumlah?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Mutasi Akun
            </DialogTitle>
            <DialogDescription>Silakan ubah data mutasi akun</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
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

            {/* Kas Keuangan (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Kas Keuangan</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{data?.kas ?? "-"}</p>
              </div>
            </div>

            {/* Akun Kredit (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Akun Kredit</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">
                  {data?.akun_kredit ?? "-"}
                </p>
              </div>
            </div>

            {/* Akun Debit (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Akun Debit</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">
                  {data?.akun_debit ?? "-"}
                </p>
              </div>
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

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label
                htmlFor="keterangan"
                className="text-slate-600 font-medium"
              >
                Keterangan
              </Label>
              <textarea
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
