import { Filter } from "lucide-react";
import { KAS_OPTIONS } from "./types";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface HistoryRiilFilterBarProps {
  tanggalMulai?: string;
  tanggalSelesai?: string;
  kas?: string;
  onTanggalMulaiChange: (value: string) => void;
  onTanggalSelesaiChange: (value: string) => void;
  onKasChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
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
}: HistoryRiilFilterBarProps) {
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
                {KAS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
