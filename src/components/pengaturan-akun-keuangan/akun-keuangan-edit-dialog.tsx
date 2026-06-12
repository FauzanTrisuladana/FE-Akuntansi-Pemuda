import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import type { AkunKeuanganFormErrors, AkunKeuanganRecord } from "./types";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

interface AkunKeuanganEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  akun: AkunKeuanganRecord | null;
  onSave: (payload: {
    id: number;
    namaAkun: string;
    kasId: number;
    keterangan?: string;
  }) => Promise<boolean> | boolean;
  kasOptions: Array<{ id: number; nama: string }>;
  errors?: AkunKeuanganFormErrors;
}

export function AkunKeuanganEditDialog({
  open,
  onOpenChange,
  akun,
  onSave,
  kasOptions,
  errors,
}: AkunKeuanganEditDialogProps) {
  const [namaAkun, setNamaAkun] = useState("");
  const [kasId, setKasId] = useState<string>("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (akun) {
      setNamaAkun(akun.namaAkun);
      const kasOption = kasOptions.find((k) => k.nama === akun.kas);
      setKasId(kasOption ? kasOption.id.toString() : "");
      setKeterangan(akun.keterangan ?? "");
    }
  }, [akun, kasOptions]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!akun) return;
    setIsLoading(true);
    try {
      const success = await onSave({
        id: akun.id,
        namaAkun,
        kasId: parseInt(kasId, 10),
        keterangan: keterangan.trim() || undefined,
      });
      if (success) onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = namaAkun.trim() !== "" && kasId !== "";

  const generalError = errors?.general?.[0];
  const kasError = errors?.kasId?.[0] ?? errors?.kas?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Akun Keuangan
            </DialogTitle>
            <DialogDescription>
              Silakan ubah data akun keuangan
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Nama Akun (editable) */}
            <div className="grid gap-2">
              <Label htmlFor="nama-akun" className="text-slate-600 font-medium">
                Nama Akun*
              </Label>
              <Input
                id="nama-akun"
                value={namaAkun}
                onChange={(e) => setNamaAkun(e.target.value)}
                placeholder="Masukkan nama akun"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            {/* Kas */}
            <div className="grid gap-2">
              <Label
                htmlFor="kas-select"
                className="text-slate-600 font-medium"
              >
                Kas*
              </Label>
              <Select value={kasId} onValueChange={setKasId}>
                <SelectTrigger
                  id="kas-select"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                >
                  <SelectValue placeholder="Pilih Kas" />
                </SelectTrigger>
                <SelectContent>
                  {kasOptions.map((k) => (
                    <SelectItem key={k.id} value={k.id.toString()}>
                      {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {kasError ? (
                <p className="text-sm text-destructive">{kasError}</p>
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
