import { formatCurrency } from "./types";
import { Card, CardContent } from "@/components/ui/card";

interface LaporanKeuanganSummaryProps {
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  kasDiTangan: number;
}

export function LaporanKeuanganSummary({
  saldoAwal,
  totalPemasukan,
  totalPengeluaran,
  kasDiTangan,
}: LaporanKeuanganSummaryProps) {
  return (
    <Card className="bg-slate-900 text-white w-full lg:w-64 flex-shrink-0 h-full flex flex-col">
      <CardContent className="px-4 flex flex-col justify-between h-full">
        <h3 className="text-sm font-bold mb-3 pb-2 border-b border-slate-700">
          Ringkasan Laporan
        </h3>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex justify-between items-center mt-4 mb-2">
            <span className="text-sm text-slate-300">Saldo Awal</span>
            <span className="text-sm font-semibold text-slate-100">
              {formatCurrency(saldoAwal)}
            </span>
          </div>
          <div className="flex justify-between items-center my-2">
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
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
            <span className="text-sm text-slate-300">Kas Di tangan/Bank</span>
            <span className="text-sm font-semibold text-blue-400">
              {formatCurrency(kasDiTangan)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
