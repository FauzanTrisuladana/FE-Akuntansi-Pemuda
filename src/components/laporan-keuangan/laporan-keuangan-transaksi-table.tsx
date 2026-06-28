import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Calendar } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatCurrency } from "./types";
import { LaporanKeuanganEvidenceDialog } from "./laporan-keuangan-evidence-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { LaporanKeuanganTransaksiRecord } from "./types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LaporanKeuanganTransaksiTableProps {
  data: Array<LaporanKeuanganTransaksiRecord>;
  isLoading?: boolean;
  kasNama?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export function LaporanKeuanganTransaksiTable({
  data,
  isLoading,
  kasNama = "Kas Keuangan",
  tanggalMulai,
  tanggalSelesai,
}: LaporanKeuanganTransaksiTableProps) {
  const columns = React.useMemo<
    Array<ColumnDef<LaporanKeuanganTransaksiRecord>>
  >(
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
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.deskripsi}
          </span>
        ),
      },
      {
        accessorKey: "akun_transaksi",
        header: "Akun Transaksi",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.akun_transaksi}
          </span>
        ),
      },
      {
        accessorKey: "tipe",
        header: "Tipe",
        cell: ({ row }) => {
          const tipe = row.original.tipe;
          const isPemasukan = tipe === "pemasukan";
          return (
            <Badge
              variant="outline"
              className={`cursor-default rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                isPemasukan
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {isPemasukan ? (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  Pemasukan
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4" />
                  Pengeluaran
                </>
              )}
            </Badge>
          );
        },
      },
      {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => {
          const jumlah = row.original.jumlah;
          const isPemasukan = row.original.tipe === "pemasukan";
          return (
            <span
              className={`text-sm font-medium ${
                isPemasukan ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(jumlah)}
            </span>
          );
        },
      },
      {
        id: "bukti",
        header: "Bukti",
        cell: ({ row }) => {
          const bukti = row.original.bukti;
          return bukti ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleViewBukti(row.original)}
            >
              Lihat Bukti
            </Button>
          ) : (
            <span className="text-sm text-slate-400">-</span>
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

  const [evidenceDialogOpen, setEvidenceDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] =
    React.useState<LaporanKeuanganTransaksiRecord | null>(null);

  const handleViewBukti = (record: LaporanKeuanganTransaksiRecord) => {
    setSelectedRecord(record);
    setEvidenceDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Transaksi Keuangan ({kasNama})
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

      <LaporanKeuanganEvidenceDialog
        open={evidenceDialogOpen}
        onOpenChange={setEvidenceDialogOpen}
        data={selectedRecord}
      />
    </div>
  );
}
