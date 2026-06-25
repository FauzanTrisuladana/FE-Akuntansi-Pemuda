import { formatCurrency } from "./types";
import { SummaryCard } from "@/components/ui/summary-card";

interface TransaksiKeuanganSummaryProps {
  totalPemasukan: number;
  totalPengeluaran: number;
  isLoading?: boolean;
}

export function TransaksiKeuanganSummary({
  totalPemasukan,
  totalPengeluaran,
  isLoading,
}: TransaksiKeuanganSummaryProps) {
  return (
    <SummaryCard
      title="Total Berdasarkan Filter"
      isLoading={isLoading}
      items={[
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
      ]}
    />
  );
}
