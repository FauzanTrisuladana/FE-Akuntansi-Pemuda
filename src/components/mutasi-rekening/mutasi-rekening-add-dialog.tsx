import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { MutasiRekeningFormErrors } from "./types";
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
type MutasiRekeningAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (payload: {
    tanggal: string;
    akunDebit: string;
    akunKredit: string;
    jumlah: number;
    keterangan?: string;
  }) => boolean;
  errors?: MutasiRekeningFormErrors;
  akunOptions: Array<{ id: number; nama: string }>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function MutasiRekeningAddDialog({
  open,
  onOpenChange,
  onCreate,
  errors: _errors,
  akunOptions,
}: MutasiRekeningAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled
    ? (onOpenChange as (o: boolean) => void)
    : setInternalOpen;

  const [tanggal, setTanggal] = useState("");
  const [akunDebit, setAkunDebit] = useState("");
  const [akunKredit, setAkunKredit] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    tanggal.trim() !== "" &&
    akunDebit !== "" &&
    akunKredit !== "" &&
    jumlah.trim() !== "";

  const resetForm = () => {
    setTanggal("");
    setAkunDebit("");
    setAkunKredit("");
    setJumlah("");
    setKeterangan("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const success = await onCreate({
        tanggal: tanggal.trim(),
        akunDebit,
        akunKredit,
        jumlah: parseFloat(jumlah),
        keterangan: keterangan.trim() || undefined,
      });
      if (success) {
        setDialogOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Gagal membuat mutasi akun baru");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    setDialogOpen(val);
  };

  const generalError = _errors?.general?.[0];
  const tanggalError = _errors?.tanggal?.[0];
  const akunDebitError = _errors?.akunDebit?.[0];
  const akunKreditError = _errors?.akunKredit?.[0];
  const jumlahError = _errors?.jumlah?.[0];

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Lakukan Mutasi Akun
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan mutasi akun baru
            </DialogDescription>
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

            {/* Akun Kredit (Asal Dana) */}
            <div className="grid gap-2">
              <Label
                htmlFor="akun-kredit"
                className="text-slate-600 font-medium"
              >
                Asal Dana / Akun Kredit<span className="text-red-500">*</span>
              </Label>
              <Select value={akunKredit} onValueChange={setAkunKredit}>
                <SelectTrigger
                  id="akun-kredit"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                  disabled={isLoading}
                >
                  <SelectValue placeholder="Pilih Akun Kredit" />
                </SelectTrigger>
                <SelectContent>
                  {akunOptions.map((akun) => (
                    <SelectItem key={akun.id} value={akun.nama}>
                      {akun.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {akunKreditError ? (
                <p className="text-sm text-destructive">{akunKreditError}</p>
              ) : null}
            </div>

            {/* Akun Debit (Tujuan Dana) */}
            <div className="grid gap-2">
              <Label
                htmlFor="akun-debit"
                className="text-slate-600 font-medium"
              >
                Tujuan Dana / Akun Debit<span className="text-red-500">*</span>
              </Label>
              <Select value={akunDebit} onValueChange={setAkunDebit}>
                <SelectTrigger
                  id="akun-debit"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                  disabled={isLoading}
                >
                  <SelectValue placeholder="Pilih Akun Debit" />
                </SelectTrigger>
                <SelectContent>
                  {akunOptions.map((akun) => (
                    <SelectItem key={akun.id} value={akun.nama}>
                      {akun.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {akunDebitError ? (
                <p className="text-sm text-destructive">{akunDebitError}</p>
              ) : null}
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
