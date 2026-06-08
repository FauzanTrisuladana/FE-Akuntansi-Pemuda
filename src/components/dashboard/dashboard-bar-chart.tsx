import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { SaldoHarian } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#22c55e",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function DashboardBarChart({
  chartData,
}: {
  chartData?: Array<SaldoHarian>;
}) {
  const processedData =
    chartData?.map((item) => ({
      hari: item.tanggal,
      pemasukan: item.pemasukan,
      pengeluaran: item.pengeluaran,
    })) || [];

  return (
    <Card className="h-full shadow-lg border-3 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold text-slate-900">
          Perbandingan Pemasukan & Pengeluaran Per Minggu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          <BarChart accessibilityLayer data={processedData} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hari"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              stroke="#94a3b8"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value / 1000000}jt`}
              stroke="#94a3b8"
            />
            <ChartTooltip
              cursor={{ fill: "transparent" }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="pemasukan"
              fill="var(--color-pemasukan)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="pengeluaran"
              fill="var(--color-pengeluaran)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
