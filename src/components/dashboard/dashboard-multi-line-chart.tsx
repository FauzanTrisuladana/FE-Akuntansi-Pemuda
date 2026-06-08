import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { SaldoPerAkun } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  kasDitangan: {
    label: "Kas Ditangan (Retail)",
    color: "#3b82f6",
  },
  kasModal: {
    label: "Kas Modal",
    color: "#22c55e",
  },
  kasOperasional: {
    label: "Kas Operasional",
    color: "#f59e04",
  },
  bankBca: {
    label: "Bank BCA",
    color: "#ef4444",
  },
  bankMandiri: {
    label: "Bank Mandiri",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

const AKUN_OPTIONS = [
  { id: 1, nama: "Kas Ditangan (Retail)", key: "kasDitangan" as const },
  { id: 2, nama: "Kas Modal", key: "kasModal" as const },
  { id: 3, nama: "Kas Operasional", key: "kasOperasional" as const },
  { id: 4, nama: "Bank BCA", key: "bankBca" as const },
  { id: 5, nama: "Bank Mandiri", key: "bankMandiri" as const },
];

export function DashboardMultiLineChart({
  chartData,
}: {
  chartData?: Array<SaldoPerAkun>;
}) {
  const [selectedAkun, setSelectedAkun] = useState<Array<string>>(
    AKUN_OPTIONS.map((opt) => opt.key),
  );

  const processedData =
    chartData?.map((item) => ({
      tanggal: item.tanggal,
      kasDitangan: item.kasDitangan,
      kasModal: item.kasModal,
      kasOperasional: item.kasOperasional,
      bankBca: item.bankBca,
      bankMandiri: item.bankMandiri,
    })) || [];

  return (
    <Card className="h-full shadow-lg border-3 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold text-slate-900">
          Tren Pertumbuhan Saldo per Jenis Akun
        </CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-2 px-6">
        {AKUN_OPTIONS.map((option) => {
          const isSelected = selectedAkun.includes(option.key);
          return (
            <Badge
              key={option.id}
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
            {selectedAkun.includes("kasDitangan") && (
              <Line
                dataKey="kasDitangan"
                type="monotone"
                stroke="var(--color-kasDitangan)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-kasDitangan)",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}
            {selectedAkun.includes("kasModal") && (
              <Line
                dataKey="kasModal"
                type="monotone"
                stroke="var(--color-kasModal)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-kasModal)",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}
            {selectedAkun.includes("kasOperasional") && (
              <Line
                dataKey="kasOperasional"
                type="monotone"
                stroke="var(--color-kasOperasional)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-kasOperasional)",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}
            {selectedAkun.includes("bankBca") && (
              <Line
                dataKey="bankBca"
                type="monotone"
                stroke="var(--color-bankBca)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-bankBca)",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}
            {selectedAkun.includes("bankMandiri") && (
              <Line
                dataKey="bankMandiri"
                type="monotone"
                stroke="var(--color-bankMandiri)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-bankMandiri)",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
