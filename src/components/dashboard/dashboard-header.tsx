import { Badge } from "@/components/ui/badge";

const KAS_OPTIONS = [
  { id: 1, nama: "Kas Pemuda", value: "kas pemuda" },
  { id: 2, nama: "17 an", value: "17 an" },
];

interface DashboardHeaderProps {
  selectedKas: string;
  onKasChange: (kas: string) => void;
}

export function DashboardHeader({
  selectedKas,
  onKasChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">Dashboard ringkasan keuangan</p>
      </div>
      <div className="flex gap-2">
        {KAS_OPTIONS.map((option) => {
          const isSelected = selectedKas === option.value;
          const isKasPemuda = option.value === "kas pemuda";
          return (
            <Badge
              key={option.id}
              variant="outline"
              className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                isSelected
                  ? isKasPemuda
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
              onClick={() => onKasChange(option.value)}
            >
              {option.nama}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
