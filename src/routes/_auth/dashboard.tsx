import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardLineChart } from "@/components/dashboard/dashboard-line-chart";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import { DashboardMultiLineChart } from "@/components/dashboard/dashboard-multi-line-chart";
import { DashboardMultiBarChart } from "@/components/dashboard/dashboard-multi-bar-chart";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_REKONSIALIASI,
  MOCK_SALDO_HARIAN,
  MOCK_SALDO_PER_AKUN,
  MOCK_WEEKLY_CASHFLOW,
} from "@/components/dashboard/types";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader />

      <DashboardSummaryCards stats={MOCK_DASHBOARD_STATS} />

      <DashboardLineChart chartData={MOCK_SALDO_HARIAN} />
      <DashboardBarChart chartData={MOCK_WEEKLY_CASHFLOW} />

      <DashboardMultiLineChart chartData={MOCK_SALDO_PER_AKUN} />
      <DashboardMultiBarChart chartData={MOCK_REKONSIALIASI} />
    </>
  );
}
