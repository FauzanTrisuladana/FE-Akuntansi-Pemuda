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
import { formatCurrency, toTransactionRecord } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  AkunKeuanganFormErrors,
  AkunKeuanganRecord,
  TransactionBackend,
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
import { TableSkeleton } from "@/components/ui/table-skeleton";

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
    namaAkun: string;
    kasId: number;
    keterangan?: string;
  }) => Promise<boolean> | boolean;
  onDelete?: (id: number) => Promise<boolean> | boolean;
  kasOptions?: Array<{ id: number; nama: string }>;
  editErrors?: AkunKeuanganFormErrors;
  onGetTransactions?: (
    id: number,
  ) => Promise<Array<TransactionBackend>> | undefined;
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
  onGetTransactions,
}: AkunKeuanganTableProps) {
  const [akunToEdit, setAkunToEdit] = React.useState<AkunKeuanganRecord | null>(
    null,
  );
  const [akunToDelete, setAkunToDelete] =
    React.useState<AkunKeuanganRecord | null>(null);
  const [akunToView, setAkunToView] = React.useState<AkunKeuanganRecord | null>(
    null,
  );
  const [transactions, setTransactions] = React.useState<
    Array<TransactionBackend>
  >([]);

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

  // Fetch transactions when akunToView changes
  React.useEffect(() => {
    if (akunToView && onGetTransactions) {
      const fetchData = async () => {
        try {
          const result = await onGetTransactions(akunToView.id);
          if (result) {
            setTransactions(result);
          }
        } catch {
          setTransactions([]);
        }
      };
      fetchData();
    } else {
      setTransactions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [akunToView]);

  // Calculate saldo for each transaction
  let runningSaldo = 0;
  const formattedTransactions = transactions.map((t) => {
    const converted = toTransactionRecord(t);
    runningSaldo += converted.debit - converted.kredit;
    return {
      id: converted.id,
      tanggal: converted.tanggal,
      jenisTransaksi: converted.jenisTransaksi,
      deskripsi: converted.deskripsi,
      debitDisplay: formatCurrency(converted.debit),
      kreditDisplay: formatCurrency(converted.kredit),
      saldoDisplay: formatCurrency(runningSaldo),
    };
  });

  const finalSaldo =
    transactions.length > 0 ? formatCurrency(runningSaldo) : formatCurrency(0);

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          {isInitialLoading ? (
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
                      if (index === 1) alignClass = "text-left"; // Nama Akun
                      if (index === 4) alignClass = "text-right"; // Jumlah
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
                        if (index === 1) alignClass = "text-left"; // Nama Akun
                        if (index === 4) alignClass = "text-right"; // Jumlah
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
          )}
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
