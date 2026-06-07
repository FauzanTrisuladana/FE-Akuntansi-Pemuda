import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { PenanggungJawabEditDialog } from "./penanggung-jawab-edit-dialog";
import { PenanggungJawabDeleteDialog } from "./penanggung-jawab-delete-dialog";
import { PenanggungJawabTransactionsDialog } from "./penanggung-jawab-transactions-dialog";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PenanggungJawabFormErrors,
  PenanggungJawabRecord,
  TransactionPJRecord,
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

interface PenanggungJawabTableProps {
  data: Array<PenanggungJawabRecord>;
  isLoading?: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onUpdate?: (payload: { id: number; nama: string }) => boolean;
  onDelete?: (id: number) => boolean;
  editErrors?: PenanggungJawabFormErrors;
  transactionsData?: Record<number, Array<TransactionPJRecord>>;
}

export function PenanggungJawabTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  editErrors,
  transactionsData,
}: PenanggungJawabTableProps) {
  const [pjToEdit, setPjToEdit] = React.useState<PenanggungJawabRecord | null>(
    null,
  );
  const [pjToDelete, setPjToDelete] =
    React.useState<PenanggungJawabRecord | null>(null);
  const [pjToView, setPjToView] = React.useState<PenanggungJawabRecord | null>(
    null,
  );

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const columns = React.useMemo<Array<ColumnDef<PenanggungJawabRecord>>>(
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
        accessorKey: "nama",
        header: "Nama",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900 text-sm">
            {row.original.nama}
          </span>
        ),
      },
      {
        accessorKey: "valuasi",
        header: "Valuasi Transaksi",
        cell: ({ row }) => {
          const valuasi = row.original.valuasi;
          return (
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(valuasi)}
            </span>
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
                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                onClick={() => setPjToView(row.original)}
                title="Lihat Transaksi"
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                onClick={() => setPjToEdit(row.original)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                onClick={() => setPjToDelete(row.original)}
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
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.pageCount,
  });

  const hasRows = table.getRowModel().rows.length > 0;
  const isInitialLoading = Boolean(isLoading) && !hasRows;

  // Get transactions for the selected PJ
  const transactions = pjToView ? (transactionsData?.[pjToView.id] ?? []) : [];
  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    tanggal: t.tanggal,
    deskripsi: t.deskripsi,
    akun: t.akun,
    pemasukanDisplay: formatCurrency(t.pemasukan),
    pengeluaranDisplay: formatCurrency(t.pengeluaran),
  }));

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    let alignClass = "text-center";
                    if (index === 1) alignClass = "text-left";
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
              {isInitialLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Memuat data penanggung jawab...
                  </TableCell>
                </TableRow>
              ) : hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center";
                      if (index === 1) alignClass = "text-left";
                      return (
                        <TableCell key={cell.id} className={alignClass}>
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
                    Tidak ada data penanggung jawab
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pagination.pageCount}
        total={pagination.total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <PenanggungJawabEditDialog
        open={!!pjToEdit}
        onOpenChange={(open) => !open && setPjToEdit(null)}
        data={pjToEdit}
        onUpdate={onUpdate}
        errors={editErrors}
      />

      <PenanggungJawabDeleteDialog
        open={!!pjToDelete}
        onOpenChange={(open) => !open && setPjToDelete(null)}
        data={pjToDelete}
        onDelete={onDelete}
      />

      <PenanggungJawabTransactionsDialog
        open={!!pjToView}
        onOpenChange={(open) => !open && setPjToView(null)}
        namaPj={pjToView?.nama}
        transactions={formattedTransactions}
      />
    </>
  );
}
