import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface HistoryRiilFilterBarProps {
  tanggalMulai?: string;
  tanggalSelesai?: string;
  kas?: Array<string>;
  onTanggalMulaiChange: (value: string) => void;
  onTanggalSelesaiChange: (value: string) => void;
  onKasChange: (selectedKas: Array<string>) => void;
  isLoading?: boolean;
  className?: string;
  kasOptions?: Array<{ id: number; nama: string }>;
}

export function HistoryRiilFilterBar({
  tanggalMulai,
  tanggalSelesai,
  kas,
  onTanggalMulaiChange,
  onTanggalSelesaiChange,
  onKasChange,
  isLoading,
  className,
  kasOptions,
}: HistoryRiilFilterBarProps) {
  // Default: semua checkbox tercheck
  const defaultAllKas = kasOptions?.map((o) => o.nama.toLowerCase()) ?? [];

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
            {kasOptions?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`kas-${option.id}`}
                  checked={selectedKas.map((k) => k.toLowerCase()).includes(option.nama.toLowerCase())}
                  onCheckedChange={(checked) =>
                    handleKasChange(option.nama.toLowerCase(), !!checked)
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor={`kas-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.nama.toLowerCase()}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
