import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/services/dashboardService";
import { useRoleGuard } from "@/utils/roleGuard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import { DashboardMultiLineChart } from "@/components/dashboard/dashboard-multi-line-chart";
import { DashboardMultiBarChart } from "@/components/dashboard/dashboard-multi-bar-chart";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authorized, isLoading } = useRoleGuard(["bendahara", "biasa"]);
  const [selectedKas, setSelectedKas] = useState<string>("kas pemuda");
  const getDashboardFn = useServerFn(getDashboard);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", selectedKas],
    queryFn: async () => {
      const result = await getDashboardFn({
        data: { params: { kas: selectedKas } },
      });
      return result;
    },
    staleTime: 1000 * 60 * 2,
    enabled: authorized && !isLoading,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-32 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-80 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!authorized) {
    throw redirect({ to: "/unauthorized" });
  }

  const data = dashboardQuery.data;
  const summary = data?.summary;
  const saldoDaily = data?.data?.saldo_daily ?? [];
  const saldoPerAkun = data?.data?.saldo_per_akun ?? [];
  const rekonsiliasi = data?.data?.rekonsiliasi ?? [];

  return (
    <>
      <DashboardHeader selectedKas={selectedKas} onKasChange={setSelectedKas} />

      <DashboardSummaryCards
        stats={
          summary ?? {
            pemasukan: { total: 0, change: 0 },
            pengeluaran: { total: 0, change: 0 },
            totalSaldo: { total: 0 },
          }
        }
        isLoading={dashboardQuery.isLoading}
      />

      <DashboardLineChart
        chartData={saldoDaily}
        isLoading={dashboardQuery.isLoading}
      />
      <DashboardBarChart
        chartData={saldoDaily}
        isLoading={dashboardQuery.isLoading}
      />

      <DashboardMultiLineChart
        chartData={saldoPerAkun}
        isLoading={dashboardQuery.isLoading}
      />
      <DashboardMultiBarChart
        chartData={rekonsiliasi}
        isLoading={dashboardQuery.isLoading}
      />
    </>
  );
}
