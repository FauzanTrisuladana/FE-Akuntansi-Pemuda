import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { SaldoDailyRecord } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  saldo: {
    label: "Total Saldo",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function DashboardLineChart({
  chartData,
  isLoading,
}: {
  chartData?: Array<SaldoDailyRecord>;
  isLoading?: boolean;
}) {
  const processedData =
    chartData?.map((item) => ({
      tanggal: item.tanggal,
      saldo: item.saldo,
    })) || [];

  if (isLoading) {
    return (
      <Card className="h-full shadow-lg border-3 border-slate-200 animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 w-1/2 rounded bg-slate-200" />
        </CardHeader>
        <CardContent className="h-[270px] rounded-lg bg-slate-100" />
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-lg border-3 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold text-slate-900">
          Tren Saldo Kas Bulan Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="tanggal"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split("-")[2]}
              stroke="#94a3b8"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000000}jt`}
              stroke="#94a3b8"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="saldo"
              type="monotone"
              stroke="var(--color-saldo)"
              strokeWidth={4}
              dot={{
                fill: "var(--color-saldo)",
                r: 7,
                strokeWidth: 3,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
