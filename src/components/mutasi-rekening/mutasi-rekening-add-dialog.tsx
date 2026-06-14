import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { FormEvent } from "react";
import type { MutasiRekeningFormErrors } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { getAkunDropdown } from "@/services/akunKeuanganService";

// ─── Types ────────────────────────────────────────────────────────────────────
type MutasiRekeningAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (payload: {
    tanggal: string;
    akunDebit: number;
    akunKredit: number;
    jumlah: number;
    keterangan?: string;
    kas: string;
  }) => Promise<boolean> | boolean;
  errors?: MutasiRekeningFormErrors;
  kasOptions: Array<{ id: number; nama: string }>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function MutasiRekeningAddDialog({
  open,
  onOpenChange,
  onCreate,
  errors: _errors,
  kasOptions,
}: MutasiRekeningAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [tanggal, setTanggal] = useState("");
  const [kas, setKas] = useState("");
  const [akunDebit, setAkunDebit] = useState<number | "">("");
  const [akunKredit, setAkunKredit] = useState<number | "">("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Internal query for akun dropdown based on selected kas
  const getAkunDropdownFn = useServerFn(getAkunDropdown);
  const akunDropdownQuery = useQuery({
    queryKey: ["akun", "dropdown", kas],
    queryFn: async () => {
      if (!kas) return [];
      const result = await getAkunDropdownFn({
        data: { kas: [kas.toLowerCase()] },
      });
      if (!result?.data) return [];
      return result.data.map((a: { id: number; nama_akun: string }) => ({
        id: a.id,
        nama: a.nama_akun,
      }));
    },
    enabled: !!kas,
    staleTime: 1000 * 60 * 10,
  });

  // Reset akun debit/kredit when kas changes
  useEffect(() => {
    setAkunDebit("");
    setAkunKredit("");
  }, [kas]);

  const isFormValid =
    tanggal.trim() !== "" &&
    kas !== "" &&
    akunDebit !== "" &&
    akunKredit !== "" &&
    jumlah.trim() !== "";

  const resetForm = () => {
    setTanggal("");
    setKas("");
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
        akunDebit: typeof akunDebit === "number" ? akunDebit : 0,
        akunKredit: typeof akunKredit === "number" ? akunKredit : 0,
        jumlah: parseFloat(jumlah),
        keterangan: keterangan.trim() || undefined,
        kas: kas.toLowerCase(),
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
  const kasError = _errors?.kas?.[0];
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

            {/* Kas Keuangan */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">
                Kas Keuangan<span className="text-red-500">*</span>
              </Label>
              {kasError ? (
                <p className="text-sm text-destructive">{kasError}</p>
              ) : null}
              <div className="flex gap-3">
                {kasOptions.map((option) => {
                  const isSelected = kas === option.nama;
                  const isKasPemuda =
                    option.nama.toLowerCase() === "kas pemuda";
                  return (
                    <Badge
                      key={option.id}
                      variant="outline"
                      className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                        isSelected
                          ? isKasPemuda
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
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

            {/* Akun Kredit (Asal Dana) - hanya tampil jika kas sudah dipilih */}
            {kas && (
              <div className="grid gap-2">
                <Label
                  htmlFor="akun-kredit"
                  className="text-slate-600 font-medium"
                >
                  Asal Dana / Akun Kredit<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={akunKredit.toString()}
                  onValueChange={(val) =>
                    setAkunKredit(val ? parseInt(val, 10) : "")
                  }
                >
                  <SelectTrigger
                    id="akun-kredit"
                    className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                    disabled={isLoading || akunDropdownQuery.isLoading}
                  >
                    <SelectValue placeholder="Pilih Akun Kredit" />
                  </SelectTrigger>
                  <SelectContent>
                    {akunDropdownQuery.data?.map((akun) => (
                      <SelectItem key={akun.id} value={akun.id.toString()}>
                        {akun.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {akunKreditError ? (
                  <p className="text-sm text-destructive">{akunKreditError}</p>
                ) : null}
              </div>
            )}

            {/* Akun Debit (Tujuan Dana) - hanya tampil jika kas sudah dipilih */}
            {kas && (
              <div className="grid gap-2">
                <Label
                  htmlFor="akun-debit"
                  className="text-slate-600 font-medium"
                >
                  Tujuan Dana / Akun Debit
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={akunDebit.toString()}
                  onValueChange={(val) =>
                    setAkunDebit(val ? parseInt(val, 10) : "")
                  }
                >
                  <SelectTrigger
                    id="akun-debit"
                    className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                    disabled={isLoading || akunDropdownQuery.isLoading}
                  >
                    <SelectValue placeholder="Pilih Akun Debit" />
                  </SelectTrigger>
                  <SelectContent>
                    {akunDropdownQuery.data?.map((akun) => (
                      <SelectItem key={akun.id} value={akun.id.toString()}>
                        {akun.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {akunDebitError ? (
                  <p className="text-sm text-destructive">{akunDebitError}</p>
                ) : null}
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

            {/* Keterangan - hanya tampil jika kas sudah dipilih */}
            {kas && (
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
            )}

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
