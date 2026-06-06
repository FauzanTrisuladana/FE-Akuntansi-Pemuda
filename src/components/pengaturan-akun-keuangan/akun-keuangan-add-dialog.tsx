import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { AkunKeuanganFormErrors } from "./types";
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

// ─── Types ────────────────────────────────────────────────────────────────────
type AkunKeuanganAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (payload: {
    namaAkun: string;
    kasId: number;
    keterangan?: string;
  }) => boolean;
  errors?: AkunKeuanganFormErrors;
  kasOptions: Array<{ id: number; nama: string }>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function AkunKeuanganAddDialog({
  open,
  onOpenChange,
  onCreate,
  errors: _errors,
  kasOptions,
}: AkunKeuanganAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled
    ? (onOpenChange as (o: boolean) => void)
    : setInternalOpen;

  const [namaAkun, setNamaAkun] = useState("");
  const [kasId, setKasId] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = namaAkun.trim() !== "" && kasId !== "";

  const resetForm = () => {
    setNamaAkun("");
    setKasId("");
    setKeterangan("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const success = await onCreate({
        namaAkun: namaAkun.trim(),
        kasId: parseInt(kasId, 10),
        keterangan: keterangan.trim() || undefined,
      });
      if (success) {
        setDialogOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Gagal membuat akun keuangan baru");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    setDialogOpen(val);
  };

  const generalError = _errors?.general?.[0];
  const namaAkunError = _errors?.namaAkun?.[0];
  const kasError = _errors?.kasId?.[0] ?? _errors?.kas?.[0];

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tambah Akun Keuangan
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan akun keuangan baru
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Nama Akun */}
            <div className="grid gap-2">
              <Label htmlFor="namaAkun" className="text-slate-600 font-medium">
                Nama Akun*
              </Label>
              <Input
                id="namaAkun"
                value={namaAkun}
                onChange={(e) => setNamaAkun(e.target.value)}
                placeholder="Masukkan nama akun"
                className="h-12"
                disabled={isLoading}
              />
              {namaAkunError ? (
                <p className="text-sm text-destructive">{namaAkunError}</p>
              ) : null}
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
                  {kasOptions.map((kas) => (
                    <SelectItem key={kas.id} value={kas.id.toString()}>
                      {kas.nama}
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
              onClick={() => handleOpenChange(false)}
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
