import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TransaksiKeuanganFilterBarProps {
  tanggalMulai?: string;
  tanggalSelesai?: string;
  kas?: string;
  akun?: string;
  tipe?: Array<string>;
  onTanggalMulaiChange: (value: string) => void;
  onTanggalSelesaiChange: (value: string) => void;
  onKasChange: (value: string) => void;
  onAkunChange: (value: string) => void;
  onTipeChange: (value: Array<string>) => void;
  kasOptions: Array<{ id: number; nama: string }>;
  akunOptions: Array<{ id: number; nama: string }>;
  isLoading?: boolean;
  className?: string;
}

export function TransaksiKeuanganFilterBar({
  tanggalMulai,
  tanggalSelesai,
  kas,
  akun,
  tipe,
  onTanggalMulaiChange,
  onTanggalSelesaiChange,
  onKasChange,
  onAkunChange,
  onTipeChange,
  kasOptions,
  akunOptions,
  isLoading,
  className,
}: TransaksiKeuanganFilterBarProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all px-4 py-2",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Rentang Tanggal:</span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Input
              id="tanggal_mulai"
              type="date"
              value={tanggalMulai ?? ""}
              onChange={(e) => onTanggalMulaiChange(e.target.value)}
              className="h-9 flex-1"
              disabled={isLoading}
            />
          </div>

          <span className="font-medium text-slate-500">-</span>

          <div className="flex items-center gap-2 flex-1">
            <Input
              id="tanggal_selesai"
              type="date"
              value={tanggalSelesai ?? ""}
              onChange={(e) => onTanggalSelesaiChange(e.target.value)}
              className="h-9 flex-1"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Kas:</span>
          </div>

          <div className="flex-1">
            <Select value={kas ?? "all"} onValueChange={onKasChange}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Pilih Kas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kas</SelectItem>
                {kasOptions.map((option) => (
                  <SelectItem key={option.id} value={option.nama}>
                    {option.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Akun:</span>
          </div>

          <div className="flex-1">
            <Select value={akun ?? "all"} onValueChange={onAkunChange}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Pilih Akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Akun</SelectItem>
                {akunOptions.map((option) => (
                  <SelectItem key={option.id} value={option.nama}>
                    {option.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tipe:</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="pemasukan"
                checked={tipe?.includes("pemasukan") ?? true}
                onCheckedChange={(checked) => {
                  const newTipe = [...(tipe ?? ["pemasukan", "pengeluaran"])];
                  if (checked) {
                    if (!newTipe.includes("pemasukan"))
                      newTipe.push("pemasukan");
                  } else {
                    const idx = newTipe.indexOf("pemasukan");
                    if (idx > -1) newTipe.splice(idx, 1);
                  }
                  onTipeChange(
                    newTipe.length === 0
                      ? ["pemasukan", "pengeluaran"]
                      : newTipe,
                  );
                }}
                disabled={isLoading}
              />
              <label htmlFor="pemasukan" className="text-sm font-medium">
                Pemasukan
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="pengeluaran"
                checked={tipe?.includes("pengeluaran") ?? true}
                onCheckedChange={(checked) => {
                  const newTipe = [...(tipe ?? ["pemasukan", "pengeluaran"])];
                  if (checked) {
                    if (!newTipe.includes("pengeluaran"))
                      newTipe.push("pengeluaran");
                  } else {
                    const idx = newTipe.indexOf("pengeluaran");
                    if (idx > -1) newTipe.splice(idx, 1);
                  }
                  onTipeChange(
                    newTipe.length === 0
                      ? ["pemasukan", "pengeluaran"]
                      : newTipe,
                  );
                }}
                disabled={isLoading}
              />
              <label htmlFor="pengeluaran" className="text-sm font-medium">
                Pengeluaran
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
