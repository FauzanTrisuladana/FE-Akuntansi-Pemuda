import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface AkunKeuanganFilterBarProps {
  kasOptions: Array<{ id: number; nama: string }>;
  onKasFilterChange: (selectedKas: Array<string>) => void;
  defaultSelectedKas?: Array<string>;
  isLoading?: boolean;
  className?: string;
}

export function AkunKeuanganFilterBar({
  kasOptions,
  onKasFilterChange,
  defaultSelectedKas,
  isLoading,
  className,
}: AkunKeuanganFilterBarProps) {
  // Default: semua checkbox tercheck
  const defaultAllKas = kasOptions.map((o) => o.nama);

  const [selectedKas, setSelectedKas] = React.useState<Array<string>>(
    defaultSelectedKas ?? defaultAllKas,
  );

  // Sync state with URL params
  React.useEffect(() => {
    if (defaultSelectedKas !== undefined) {
      setSelectedKas(defaultSelectedKas);
    }
  }, [defaultSelectedKas]);

  const handleKasChange = (kasNama: string, checked: boolean) => {
    let newSelectedKas = checked
      ? [...selectedKas, kasNama]
      : selectedKas.filter((k) => k !== kasNama);
    // Prevent empty selection - if all unchecked, keep all checked
    if (newSelectedKas.length === 0) {
      newSelectedKas = [...defaultAllKas];
    }
    setSelectedKas(newSelectedKas);
    onKasFilterChange(newSelectedKas);
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all px-4 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-6">
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
      </div>
    </div>
  );
}
