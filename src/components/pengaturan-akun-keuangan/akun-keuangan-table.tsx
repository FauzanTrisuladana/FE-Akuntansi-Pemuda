import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AkunKeuanganEditDialog } from "./akun-keuangan-edit-dialog";
import { AkunKeuanganDeleteDialog } from "./akun-keuangan-delete-dialog";
import { AkunKeuanganTransactionsDialog } from "./akun-keuangan-transactions-dialog";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  AkunKeuanganFormErrors,
  AkunKeuanganRecord,
  TransactionRecord,
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

interface AkunKeuanganTableProps {
  data: Array<AkunKeuanganRecord>;
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
    kasId: number;
    keterangan?: string;
  }) => boolean;
  onDelete?: (id: number) => boolean;
  kasOptions?: Array<{ id: number; nama: string }>;
  editErrors?: AkunKeuanganFormErrors;
  transactionsData?: Record<number, Array<TransactionRecord>>;
}

export function AkunKeuanganTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  kasOptions,
  editErrors,
  transactionsData,
}: AkunKeuanganTableProps) {
  const [akunToEdit, setAkunToEdit] = React.useState<AkunKeuanganRecord | null>(
    null,
  );
  const [akunToDelete, setAkunToDelete] =
    React.useState<AkunKeuanganRecord | null>(null);
  const [akunToView, setAkunToView] = React.useState<AkunKeuanganRecord | null>(
    null,
  );

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const columns = React.useMemo<Array<ColumnDef<AkunKeuanganRecord>>>(
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
        accessorKey: "namaAkun",
        header: "Nama Akun",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900 text-sm">
            {row.original.namaAkun}
          </span>
        ),
      },
      {
        accessorKey: "kas",
        header: "Kas",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.kas}</span>
        ),
      },
      {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => {
          const jumlah = row.original.jumlah;
          return (
            <span
              className={`text-sm font-medium ${jumlah > 0 ? "text-green-600" : "text-slate-700"}`}
            >
              {formatCurrency(jumlah)}
            </span>
          );
        },
      },
      {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.keterangan ?? "-"}
          </span>
        ),
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
                onClick={() => setAkunToView(row.original)}
                title="Lihat Transaksi"
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                onClick={() => setAkunToEdit(row.original)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                onClick={() => setAkunToDelete(row.original)}
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

  // Get transactions for the selected account
  const transactions = akunToView
    ? (transactionsData?.[akunToView.id] ?? [])
    : [];
  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    tanggal: t.tanggal,
    jenisTransaksi: t.jenisTransaksi,
    deskripsi: t.deskripsi,
    debitDisplay: formatCurrency(t.debit),
    kreditDisplay: formatCurrency(t.kredit),
    saldoDisplay: formatCurrency(t.saldo),
  }));

  const finalSaldo =
    transactions.length > 0
      ? formatCurrency(transactions[transactions.length - 1].saldo)
      : formatCurrency(0);

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
                    Memuat data akun keuangan...
                  </TableCell>
                </TableRow>
              ) : hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center";
                      if (index === 1) alignClass = "text-left";
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
                    className="h-24 text-center"
                  >
                    Tidak ada akun keuangan ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageCount={pagination.pageCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <AkunKeuanganEditDialog
        open={!!akunToEdit}
        onOpenChange={(isOpen) => !isOpen && setAkunToEdit(null)}
        akun={akunToEdit}
        onSave={(payload) => {
          if (typeof onUpdate === "function") return onUpdate(payload);
          return false;
        }}
        kasOptions={kasOptions ?? []}
        errors={editErrors}
      />

      <AkunKeuanganDeleteDialog
        open={!!akunToDelete}
        onOpenChange={(isOpen) => !isOpen && setAkunToDelete(null)}
        akun={akunToDelete}
        onConfirm={(id) => {
          if (typeof onDelete === "function") return onDelete(id);
          return false;
        }}
      />

      <AkunKeuanganTransactionsDialog
        open={!!akunToView}
        onOpenChange={(isOpen) => !isOpen && setAkunToView(null)}
        namaAkun={akunToView?.namaAkun}
        kas={akunToView?.kas}
        transactions={formattedTransactions}
        finalSaldoDisplay={finalSaldo}
      />
    </>
  );
}
