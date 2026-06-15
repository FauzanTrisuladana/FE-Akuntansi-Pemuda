import { formatCurrency } from "./types";
import { Card, CardContent } from "@/components/ui/card";

interface TransaksiKeuanganSummaryProps {
  totalPemasukan: number;
  totalPengeluaran: number;
}

export function TransaksiKeuanganSummary({
  totalPemasukan,
  totalPengeluaran,
}: TransaksiKeuanganSummaryProps) {
  return (
    <Card className="bg-slate-900 text-white w-full lg:w-64 flex-shrink-0 h-full flex flex-col max-h-36 sm:max-h-none">
      <CardContent className="px-4 flex flex-col justify-between h-full overflow-y-auto">
        <h3 className="text-sm font-bold mb-3 pb-2 border-b border-slate-700">
          Total Berdasarkan Filter
        </h3>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex justify-between items-center mt-4 mb-2">
            <span className="text-sm text-slate-300">Pemasukan</span>
            <span className="text-sm font-semibold text-green-400">
              {formatCurrency(totalPemasukan)}
            </span>
          </div>
          <div className="flex justify-between items-center my-2">
            <span className="text-sm text-slate-300">Pengeluaran</span>
            <span className="text-sm font-semibold text-rose-400">
              {formatCurrency(totalPengeluaran)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
