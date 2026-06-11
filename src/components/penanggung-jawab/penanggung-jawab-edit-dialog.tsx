import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { PenanggungJawabFormErrors, PenanggungJawabRecord } from "./types";
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

// ─── Types ────────────────────────────────────────────────────────────────────
type PenanggungJawabEditDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  data?: PenanggungJawabRecord | null;
  onUpdate?: (payload: { id: number; nama: string }) => Promise<boolean> | boolean;
  errors?: PenanggungJawabFormErrors;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function PenanggungJawabEditDialog({
  open,
  onOpenChange,
  data,
  onUpdate,
  errors: _errors,
}: PenanggungJawabEditDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [nama, setNama] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setNama(data.nama);
    }
  }, [data]);

  const isFormValid = nama.trim() !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !data) return;

    setIsLoading(true);
    try {
      const success = await onUpdate?.({
        id: data.id,
        nama: nama.trim(),
      });
      if (success) {
        setDialogOpen(false);
      }
    } catch {
      toast.error("Gagal memperbarui penanggung jawab");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setNama("");
    }
    setDialogOpen(val);
  };

  const generalError = _errors?.general?.[0];
  const namaError = _errors?.nama?.[0];

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Penanggung Jawab
            </DialogTitle>
            <DialogDescription>
              Silakan tambah data Akun Keuangan
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="nama" className="text-slate-600 font-medium">
                Nama<span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama penanggung jawab"
                className="h-12"
                disabled={isLoading}
              />
              {namaError ? (
                <p className="text-sm text-destructive">{namaError}</p>
              ) : null}
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
