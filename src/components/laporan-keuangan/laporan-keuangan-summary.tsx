import { formatCurrency } from "./types";
import { SummaryCard } from "@/components/ui/summary-card";

interface LaporanKeuanganSummaryProps {
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  kasDiTangan: number;
  isLoading?: boolean;
}

export function LaporanKeuanganSummary({
  saldoAwal,
  totalPemasukan,
  totalPengeluaran,
  kasDiTangan,
  isLoading,
}: LaporanKeuanganSummaryProps) {
  return (
    <SummaryCard
      title="Ringkasan Laporan"
      isLoading={isLoading}
      items={[
        {
          label: "Saldo Awal",
          value: formatCurrency(saldoAwal),
          valueColor: "text-slate-100",
        },
        {
          label: "Pemasukan",
          value: formatCurrency(totalPemasukan),
          valueColor: "text-green-400",
        },
        {
          label: "Pengeluaran",
          value: formatCurrency(totalPengeluaran),
          valueColor: "text-rose-400",
        },
        {
          label: "Kas Di Tangan/Bank",
          value: formatCurrency(kasDiTangan),
          valueColor: "text-blue-400",
        },
      ]}
    />
  );
}
