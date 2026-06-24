import * as React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PenanggungJawabEditDialog } from "./penanggung-jawab-edit-dialog";
import { PenanggungJawabDeleteDialog } from "./penanggung-jawab-delete-dialog";
import { PenanggungJawabTransactionsDialog } from "./penanggung-jawab-transactions-dialog";
import { formatCurrency, toTransactionPJRecord } from "./types";
import type { PenanggungJawabFormErrors, PenanggungJawabRecord } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TransactionPJBackend as ServiceTransactionPJBackend } from "@/services/penanggungJawabService";
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
  onUpdate?: (payload: {
    id: number;
    nama: string;
  }) => Promise<boolean> | boolean;
  onDelete?: (id: number) => Promise<boolean> | boolean;
  editErrors?: PenanggungJawabFormErrors;
  onGetTransactions?: (
    id: number,
  ) => Promise<Array<ServiceTransactionPJBackend>> | undefined;
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
  onGetTransactions,
}: PenanggungJawabTableProps) {
  const [pjToEdit, setPjToEdit] = React.useState<PenanggungJawabRecord | null>(
    null,
  );
  const [pjToDelete, setPjToDelete] =
    React.useState<PenanggungJawabRecord | null>(null);
  const [pjToView, setPjToView] = React.useState<PenanggungJawabRecord | null>(
    null,
  );
  const [transactions, setTransactions] = React.useState<
    Array<ServiceTransactionPJBackend>
  >([]);

  // Fetch transactions when pjToView changes
  React.useEffect(() => {
    if (pjToView && onGetTransactions) {
      const fetchData = async () => {
        try {
          const result = await onGetTransactions(pjToView.id);
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
  }, [pjToView]);

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

  const formattedTransactions = transactions.map((t) => {
    const converted = toTransactionPJRecord(t);
    return {
      id: converted.id,
      tanggal: converted.tanggal,
      deskripsi: converted.deskripsi,
      akun: converted.akun,
      pemasukanDisplay: formatCurrency(converted.pemasukan),
      pengeluaranDisplay: formatCurrency(converted.pengeluaran),
    };
  });

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
                    Tidak ada data penanggung jawab
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            pageCount={pagination.pageCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

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
