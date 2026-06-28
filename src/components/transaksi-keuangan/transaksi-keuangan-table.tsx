import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import { TransaksiKeuanganEditDialog } from "./transaksi-keuangan-edit-dialog";
import { TransaksiKeuanganDeleteDialog } from "./transaksi-keuangan-delete-dialog";
import { TransaksiKeuanganEvidenceDialog } from "./transaksi-keuangan-evidence-dialog";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  TransaksiKeuanganFormErrors,
  TransaksiKeuanganRecord,
} from "./types";
import { DataTablePagination } from "@/components/data-table-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface TransaksiKeuanganTableProps {
  data: Array<TransaksiKeuanganRecord>;
  isLoading?: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onUpdate?: (payload: {
    id: number;
    tanggal: string;
    deskripsi: string;
    akun_id: number;
    penanggung_jawab_id?: number;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: File | null;
  }) => any;
  onDelete?: (id: number) => any;
  kasOptions?: Array<{ id: number; nama: string }>;
  penanggungJawabOptions?: Array<{ id: number; nama: string }>;
  editErrors?: TransaksiKeuanganFormErrors;
}

export function TransaksiKeuanganTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  kasOptions,
  penanggungJawabOptions,
  editErrors,
}: TransaksiKeuanganTableProps) {
  const [transaksiToEdit, setTransaksiToEdit] =
    React.useState<TransaksiKeuanganRecord | null>(null);
  const [transaksiToDelete, setTransaksiToDelete] =
    React.useState<TransaksiKeuanganRecord | null>(null);
  const [transaksiToViewEvidence, setTransaksiToViewEvidence] =
    React.useState<TransaksiKeuanganRecord | null>(null);

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const columns = React.useMemo<Array<ColumnDef<TransaksiKeuanganRecord>>>(
    () => [
      {
        id: "index",
        header: "No.",
        cell: ({ row }) => {
          const index =
            row.index + 1 + pagination.pageIndex * pagination.pageSize;
          return (
            <span className="text-muted-foreground font-medium">{index}.</span>
          );
        },
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
        accessorKey: "kas",
        header: "Kas",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.kas}
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
        accessorKey: "penanggung_jawab",
        header: "Penanggung Jawab",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {row.original.penanggung_jawab}
          </span>
        ),
      },
      {
        accessorKey: "penginput",
        header: "Penginput",
        cell: ({ row }) => {
          const penginput = row.original.penginput;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src={penginput.avatar} alt={penginput.nama} />
                <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                  {penginput.nama.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-900 text-sm">
                  {penginput.nama}
                </span>
                <span className="text-xs text-muted-foreground">
                  {penginput.email}
                </span>
              </div>
            </div>
          );
        },
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
              onClick={() => setTransaksiToViewEvidence(row.original)}
            >
              Lihat Bukti
            </Button>
          ) : (
            <span className="text-sm text-slate-400">-</span>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                onClick={() => setTransaksiToEdit(row.original)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                onClick={() => setTransaksiToDelete(row.original)}
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [pagination.pageIndex, pagination.pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.pageCount,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        handlePageChange(newPagination.pageIndex);
        handlePageSizeChange(newPagination.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton columns={columns.length} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header, index) => {
                      let alignClass = "text-center";
                      if (index === 1 || index === 2 || index === 3)
                        alignClass = "text-left";
                      return (
                        <TableHead
                          key={header.id}
                          className={`font-semibold text-slate-900 ${alignClass}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50">
                      {row.getVisibleCells().map((cell, index) => {
                        let alignClass = "text-center";
                        if (index === 1 || index === 2 || index === 3)
                          alignClass = "text-left";
                        return (
                          <TableCell
                            key={cell.id}
                            className={`py-3 ${alignClass}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Tidak ada data transaksi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            pageCount={pagination.pageCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <TransaksiKeuanganEditDialog
        open={!!transaksiToEdit}
        onOpenChange={(open) => !open && setTransaksiToEdit(null)}
        data={transaksiToEdit}
        onUpdate={onUpdate}
        errors={editErrors}
        kasOptions={kasOptions ?? []}
        penanggungJawabOptions={penanggungJawabOptions ?? []}
      />

      <TransaksiKeuanganDeleteDialog
        open={!!transaksiToDelete}
        onOpenChange={(open) => !open && setTransaksiToDelete(null)}
        data={transaksiToDelete}
        onDelete={onDelete}
      />

      <TransaksiKeuanganEvidenceDialog
        open={!!transaksiToViewEvidence}
        onOpenChange={(open) => !open && setTransaksiToViewEvidence(null)}
        data={transaksiToViewEvidence}
      />
    </>
  );
}
