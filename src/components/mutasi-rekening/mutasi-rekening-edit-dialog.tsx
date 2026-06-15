import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import type { MutasiRekeningFormErrors, MutasiRekeningRecord } from "./types";
import { Badge } from "@/components/ui/badge";
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
    akunDebit: number;
    akunKredit: number;
    jumlah: number;
    keterangan?: string;
  }) => Promise<boolean> | boolean;
  errors?: MutasiRekeningFormErrors;
  akunOptions?: Array<{ id: number; nama: string }>;
  kasOptions?: Array<{ id: number; nama: string }>;
}

export function MutasiRekeningEditDialog({
  open,
  onOpenChange,
  data,
  onUpdate,
  errors: _errors,
  akunOptions: _akunOptions,
  kasOptions,
}: MutasiRekeningEditDialogProps) {
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setTanggal(data.tanggal);
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
        akunDebit: data.akun_debit_id,
        akunKredit: data.akun_kredit_id,
        jumlah: parseFloat(jumlah),
        keterangan: keterangan.trim() || undefined,
      });
      if (success) {
        onOpenChange(false);
      }
    } catch {
      // Error handled in parent
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = jumlah.trim() !== "";

  const generalError = _errors?.general?.[0];
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
            {/* Tanggal (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Tanggal</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{tanggal ?? "-"}</p>
              </div>
            </div>

            {/* Kas Keuangan (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Kas Keuangan</Label>
              <div className="flex gap-3">
                {kasOptions?.map((option) => {
                  const isSelected =
                    data?.kas.toLowerCase() === option.nama.toLowerCase();
                  const isKasPemuda =
                    option.nama.toLowerCase() === "kas pemuda";
                  return (
                    <Badge
                      key={option.id}
                      variant="outline"
                      className={`cursor-default rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                        isSelected
                          ? isKasPemuda
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {option.nama}
                    </Badge>
                  );
                })}
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
