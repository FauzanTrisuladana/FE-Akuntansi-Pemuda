import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { DashboardStats } from "./types";
import { Card, CardContent } from "@/components/ui/card";

const formatRp = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

const formatPercent = (val: number) => `${Math.abs(val).toFixed(1)}%`;

export function DashboardSummaryCards({
  stats = {
    pemasukan: { total: 0, change: 0 },
    pengeluaran: { total: 0, change: 0 },
    totalSaldo: { total: 0 },
  },
  isLoading,
}: {
  stats?: DashboardStats;
  isLoading?: boolean;
}) {
  const items = [
    {
      label: "Pemasukan Bulan Ini",
      value: formatRp(stats.pemasukan.total),
      footerText: `${formatPercent(stats.pemasukan.change)} dari bulan lalu`,
      footerTextColor:
        stats.pemasukan.change >= 0 ? "text-emerald-600" : "text-rose-600",
      footerIcon: stats.pemasukan.change >= 0 ? TrendingUp : TrendingDown,
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Pengeluaran Bulan Ini",
      value: formatRp(stats.pengeluaran.total),
      footerText: `${formatPercent(stats.pengeluaran.change)} dari bulan lalu`,
      footerTextColor:
        stats.pengeluaran.change <= 0 ? "text-emerald-600" : "text-rose-600",
      footerIcon: stats.pengeluaran.change >= 0 ? TrendingUp : TrendingDown,
      icon: TrendingDown,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
    },
    {
      label: "Total Saldo Saat Ini",
      value: formatRp(stats.totalSaldo.total),
      icon: Wallet,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card key={index} className="shadow-lg border-3 border-slate-200 p-0">
            <CardContent className="px-6 py-6 flex items-center justify-between">
              <div>
                <div className="space-y-1">
                  <p className="text-sm 2xl:text-md font-medium text-slate-500">
                    {item.label}
                  </p>
                  <h3 className="text-xl 2xl:text-4xl font-bold text-slate-900">
                    {item.value}
                  </h3>
                </div>
                {item.footerText && (
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium">
                    <item.footerIcon
                      className={`w-3.5 h-3.5 ${item.footerTextColor}`}
                    />
                    <span className={item.footerTextColor}>
                      {item.footerText}
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${item.iconBg}`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
