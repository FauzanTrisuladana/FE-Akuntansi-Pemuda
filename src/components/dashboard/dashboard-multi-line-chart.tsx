import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { SaldoPerAkunRecord } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const akunColors = [
  "#3b82f6",
  "#22c55e",
  "#f59e04",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function DashboardMultiLineChart({
  chartData,
  isLoading,
}: {
  chartData?: Array<SaldoPerAkunRecord>;
  isLoading?: boolean;
}) {
  // Extract unique akun names from API response
  const akunOptions = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const uniqueAkun = new Set<string>();
    chartData.forEach((item) => {
      item.akun.forEach((a) => uniqueAkun.add(a.nama_akun));
    });
    return Array.from(uniqueAkun).map((nama, idx) => ({
      key: nama.toLowerCase().replace(/[\s()]/g, "_"),
      nama,
      color: akunColors[idx % akunColors.length],
    }));
  }, [chartData]);

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        akunOptions.map((opt) => [
          opt.key,
          { label: opt.nama, color: opt.color },
        ]),
      ) satisfies ChartConfig,
    [akunOptions],
  );

  const [selectedAkun, setSelectedAkun] = useState<Array<string>>(() =>
    akunOptions.map((opt) => opt.key),
  );

  // Sync selectedAkun when akunOptions change
  useMemo(() => {
    setSelectedAkun(akunOptions.map((opt) => opt.key));
  }, [akunOptions]);

  // Dynamically build chart data from backend response
  const processedData =
    chartData?.map((item) => {
      const record: Record<string, number | string> = { tanggal: item.tanggal };
      item.akun.forEach((a) => {
        const key = a.nama_akun.toLowerCase().replace(/[\s()]/g, "_");
        record[key] = a.saldo;
      });
      return record;
    }) || [];

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
          Tren Pertumbuhan Saldo per Akun
        </CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-2 px-6">
        {akunOptions.map((option) => {
          const isSelected = selectedAkun.includes(option.key);
          return (
            <Badge
              key={option.key}
              variant="outline"
              className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                isSelected
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
              onClick={() => {
                if (isSelected) {
                  setSelectedAkun(selectedAkun.filter((k) => k !== option.key));
                } else {
                  setSelectedAkun([...selectedAkun, option.key]);
                }
              }}
            >
              {option.nama}
            </Badge>
          );
        })}
      </div>
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
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
            />
            {akunOptions
              .filter((opt) => selectedAkun.includes(opt.key))
              .map((opt) => (
                <Line
                  key={opt.key}
                  dataKey={opt.key}
                  type="monotone"
                  stroke={opt.color}
                  strokeWidth={3}
                  dot={{
                    fill: opt.color,
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
