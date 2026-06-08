import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import { formatCurrency } from "./types";
import { HistoryRiilVerifyDialog } from "./history-riil-verify-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { HistoryRiilRecord } from "./types";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryRiilTableProps {
  data: Array<HistoryRiilRecord>;
  isLoading?: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
  };
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onVerify?: (id: number) => boolean;
}

export function HistoryRiilTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onVerify,
}: HistoryRiilTableProps) {
  const [recordToVerify, setRecordToVerify] =
    React.useState<HistoryRiilRecord | null>(null);

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const columns = React.useMemo<Array<ColumnDef<HistoryRiilRecord>>>(
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
          <span className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-800" />
            {row.original.tanggal}
          </span>
        ),
      },
      {
        accessorKey: "nama_akun",
        header: "Nama Akun",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900 text-sm">
            {row.original.nama_akun}
          </span>
        ),
      },
      {
        accessorKey: "kas",
        header: "Kas",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900 text-sm">
            {row.original.kas}
          </span>
        ),
      },
      {
        accessorKey: "nilai_riil",
        header: "Nilai Riil",
        cell: ({ row }) => {
          const nilaiRiil = row.original.nilai_riil;
          return (
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(nilaiRiil)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi Status",
        cell: ({ row }) => {
          const isVerified = row.original.is_verified;
          return isVerified ? (
            <Badge variant="green" className="cursor-not-allowed opacity-70">
              Ter - Verifikasi
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:text-green-800 hover:border-green-300"
              onClick={() => setRecordToVerify(row.original)}
            >
              Verifikasi
            </Button>
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
              {isInitialLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Memuat data history riil...
                  </TableCell>
                </TableRow>
              ) : hasRows ? (
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
                    Tidak ada data history riil
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

      <HistoryRiilVerifyDialog
        open={!!recordToVerify}
        onOpenChange={(open) => !open && setRecordToVerify(null)}
        data={recordToVerify}
        onVerify={onVerify}
      />
    </>
  );
}
