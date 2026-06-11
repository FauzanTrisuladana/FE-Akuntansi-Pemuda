import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MutasiRekeningFilterBarProps {
  tanggalMulai?: string;
  tanggalSelesai?: string;
  kas?: Array<string>;
  akun?: string;
  onTanggalMulaiChange: (value: string) => void;
  onTanggalSelesaiChange: (value: string) => void;
  onKasChange: (selectedKas: Array<string>) => void;
  onAkunChange: (value: string) => void;
  kasOptions: Array<{ id: number; nama: string }>;
  akunOptions: Array<{ id: number; nama: string }>;
  isLoading?: boolean;
  className?: string;
}

export function MutasiRekeningFilterBar({
  tanggalMulai,
  tanggalSelesai,
  kas,
  akun,
  onTanggalMulaiChange,
  onTanggalSelesaiChange,
  onKasChange,
  onAkunChange,
  kasOptions,
  akunOptions,
  isLoading,
  className,
}: MutasiRekeningFilterBarProps) {
  // Default: semua checkbox tercheck
  const defaultAllKas = kasOptions.map((o) => o.nama);

  const [selectedKas, setSelectedKas] = React.useState<Array<string>>(
    kas ?? defaultAllKas,
  );

  // Sync state with URL params
  React.useEffect(() => {
    if (kas !== undefined) {
      setSelectedKas(kas);
    }
  }, [kas]);

  const handleKasChange = (kasNama: string, checked: boolean) => {
    let newSelectedKas = checked
      ? [...selectedKas, kasNama]
      : selectedKas.filter((k) => k !== kasNama);
    // Prevent empty selection - if all unchecked, keep all checked
    if (newSelectedKas.length === 0) {
      newSelectedKas = [...defaultAllKas];
    }
    setSelectedKas(newSelectedKas);
    onKasChange(newSelectedKas);
  };

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

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Kas:</span>
          <div className="flex flex-row gap-4">
            {kasOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`kas-${option.id}`}
                  checked={selectedKas.includes(option.nama)}
                  onCheckedChange={(checked) =>
                    handleKasChange(option.nama, !!checked)
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor={`kas-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.nama}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Akun:</span>
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
      </div>
    </div>
  );
}
