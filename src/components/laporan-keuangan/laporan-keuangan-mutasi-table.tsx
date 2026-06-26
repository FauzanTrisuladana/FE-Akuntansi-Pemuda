import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type { LaporanKeuanganMutasiRecord } from "./types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface LaporanKeuanganMutasiTableProps {
  data: Array<LaporanKeuanganMutasiRecord>;
  isLoading?: boolean;
  kasNama?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export function LaporanKeuanganMutasiTable({
  data,
  isLoading,
  kasNama = "Kas Keuangan",
  tanggalMulai,
  tanggalSelesai,
}: LaporanKeuanganMutasiTableProps) {
  const columns = React.useMemo<Array<ColumnDef<LaporanKeuanganMutasiRecord>>>(
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
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-900">
              {row.original.tanggal}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "akun_debit",
        header: "Akun Debit",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.akun_debit}
          </span>
        ),
      },
      {
        accessorKey: "akun_kredit",
        header: "Akun Kredit",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.akun_kredit}
          </span>
        ),
      },
      {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency(row.original.jumlah)}
          </span>
        ),
      },
      {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.keterangan}
          </span>
        ),
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
          Transaksi Mutasi Kas ({kasNama})
        </h3>
        {tanggalMulai && tanggalSelesai && (
          <p className="text-sm text-gray-500">
            Transaksi dari {tanggalMulai} - {tanggalSelesai}
          </p>
        )}
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={columns.length} />
        ) : (
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
              {table.getRowModel().rows.length > 0 ? (
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
        )}
      </div>
    </div>
  );
}
