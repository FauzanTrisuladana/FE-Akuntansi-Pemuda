import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type { LaporanKeuanganPosisiRecord } from "./types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LaporanKeuanganPosisiTableProps {
  data: Array<LaporanKeuanganPosisiRecord>;
  isLoading?: boolean;
  kasNama?: string;
  tanggalSelesai?: string;
}

export function LaporanKeuanganPosisiTable({
  data,
  isLoading,
  kasNama = "Kas Keuangan",
  tanggalSelesai,
}: LaporanKeuanganPosisiTableProps) {
  const columns = React.useMemo<Array<ColumnDef<LaporanKeuanganPosisiRecord>>>(
    () => [
      {
        id: "index",
        header: "No.",
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">
            {row.index + 1}.
          </span>
        ),
      },
      {
        accessorKey: "nama_akun",
        header: "Nama Akun",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.nama_akun}
          </span>
        ),
      },
      {
        accessorKey: "saldo_awal",
        header: "Saldo Awal",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency(row.original.saldo_awal)}
          </span>
        ),
      },
      {
        accessorKey: "pemasukan",
        header: "Pemasukan",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(row.original.pemasukan)}
          </span>
        ),
      },
      {
        accessorKey: "pengeluaran",
        header: "Pengeluaran",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-red-600">
            {formatCurrency(row.original.pengeluaran)}
          </span>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: "riil",
        header: "Riil",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency(row.original.riil)}
          </span>
        ),
      },
      {
        accessorKey: "selisih",
        header: "Selisih",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency(row.original.selisih)}
          </span>
        ),
      },
      {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => {
          const keterangan = row.original.keterangan;
          const badgeVariant =
            keterangan === "Seimbang"
              ? "default"
              : keterangan === "Uang Lebih"
                ? "outline"
                : "destructive";
          const badgeClass =
            keterangan === "Seimbang"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200";
          return (
            <Badge
              variant={badgeVariant}
              className={`cursor-default rounded-full h-8 px-3 font-bold ${badgeClass}`}
            >
              {keterangan}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Posisi Keuangan ({kasNama})
        </h3>
        {tanggalSelesai && (
          <p className="text-sm text-gray-500">
            Posisi Keuangan ketika tanggal {tanggalSelesai}
          </p>
        )}
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-slate-50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}