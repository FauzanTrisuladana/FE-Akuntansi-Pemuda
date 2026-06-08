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
    <Card className="bg-slate-900 text-white w-full lg:w-64 flex-shrink-0">
      <CardContent className="p-4">
        <h3 className="text-sm font-bold mb-3">Total Berdasarkan Filter</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Pemasukan</span>
            <span className="text-sm font-semibold text-green-400">
              {formatCurrency(totalPemasukan)}
            </span>
          </div>
          <div className="flex justify-between items-center">
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
