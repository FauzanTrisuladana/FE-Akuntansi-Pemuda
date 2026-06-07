import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { MutasiRekeningEditDialog } from "./mutasi-rekening-edit-dialog";
import { MutasiRekeningDeleteDialog } from "./mutasi-rekening-delete-dialog";
import { formatCurrency } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import type { MutasiRekeningFormErrors, MutasiRekeningRecord } from "./types";
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

interface MutasiRekeningTableProps {
  data: Array<MutasiRekeningRecord>;
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
    akunDebit: string;
    akunKredit: string;
    jumlah: number;
    keterangan?: string;
  }) => boolean;
  onDelete?: (id: number) => boolean;
  akunOptions?: Array<{ id: number; nama: string }>;
  editErrors?: MutasiRekeningFormErrors;
}

export function MutasiRekeningTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  akunOptions,
  editErrors,
}: MutasiRekeningTableProps) {
  const [mutasiToEdit, setMutasiToEdit] =
    React.useState<MutasiRekeningRecord | null>(null);
  const [mutasiToDelete, setMutasiToDelete] =
    React.useState<MutasiRekeningRecord | null>(null);

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const columns = React.useMemo<Array<ColumnDef<MutasiRekeningRecord>>>(
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
            <span className="text-sm text-slate-700">
              {row.original.tanggal}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "akun_debit",
        header: "Akun Debit",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.akun_debit}
          </span>
        ),
      },
      {
        accessorKey: "akun_kredit",
        header: "Akun Kredit",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.akun_kredit}
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
            <span className="text-sm font-medium text-green-600">
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
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                onClick={() => setMutasiToEdit(row.original)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                onClick={() => setMutasiToDelete(row.original)}
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
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Memuat data mutasi rekening...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center";
                      if (index === 1 || index === 2 || index === 3)
                        alignClass = "text-left";
                      return (
                        <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
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
                    Tidak ada data mutasi rekening
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

      <MutasiRekeningEditDialog
        open={!!mutasiToEdit}
        onOpenChange={(open) => !open && setMutasiToEdit(null)}
        data={mutasiToEdit}
        onUpdate={onUpdate}
        errors={editErrors}
        akunOptions={akunOptions ?? []}
      />

      <MutasiRekeningDeleteDialog
        open={!!mutasiToDelete}
        onOpenChange={(open) => !open && setMutasiToDelete(null)}
        data={mutasiToDelete}
        onDelete={onDelete}
      />
    </>
  );
}
