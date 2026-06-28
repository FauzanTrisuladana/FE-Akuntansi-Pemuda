import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import type { PenanggungJawabFormErrors } from "@/components/penanggung-jawab/types";
import { useRoleGuard } from "@/utils/roleGuard";

import { PenanggungJawabAddDialog } from "@/components/penanggung-jawab/penanggung-jawab-add-dialog";
import { PenanggungJawabTable } from "@/components/penanggung-jawab/penanggung-jawab-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  createPenanggungJawab,
  deletePenanggungJawab,
  getPenanggungJawab,
  getPenanggungJawabDetail,
  updatePenanggungJawab,
} from "@/services/penanggungJawabService";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const penanggungJawabSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/penanggung-jawab")({
  validateSearch: penanggungJawabSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const { authorized, isLoading } = useRoleGuard(["bendahara"]);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const { page, per_page, search: searchQuery } = search;

  // API query
  const getPenanggungJawabFn = useServerFn(getPenanggungJawab);
  const getPenanggungJawabDetailFn = useServerFn(getPenanggungJawabDetail);
  const createPenanggungJawabFn = useServerFn(createPenanggungJawab);
  const updatePenanggungJawabFn = useServerFn(updatePenanggungJawab);
  const deletePenanggungJawabFn = useServerFn(deletePenanggungJawab);

  const penanggungJawabQuery = useQuery({
    queryKey: ["penanggungJawab", { page, per_page, search: searchQuery }],
    queryFn: async () => {
      const response = await getPenanggungJawabFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
          },
        },
      });
      return response;
    },
    staleTime: 1000 * 60 * 2,
    enabled: authorized && !isLoading,
  });

  const total = penanggungJawabQuery.data?.meta?.total ?? 0;
  const pageCount = penanggungJawabQuery.data?.meta?.last_page ?? 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<PenanggungJawabFormErrors>(null);
  const [editErrors, setEditErrors] = useState<PenanggungJawabFormErrors>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-96 rounded-lg bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!authorized) {
    throw redirect({ to: "/unauthorized" });
  }

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/penanggung-jawab",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleAdd = async (payload: { nama: string }): Promise<boolean> => {
    setAddErrors(null);
    try {
      const result = await createPenanggungJawabFn({ data: payload });
      toast.success(result?.message || "Penanggung jawab berhasil ditambahkan");
      queryClient.invalidateQueries();
      setOpen(false);
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as PenanggungJawabFormErrors;
      setAddErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menambahkan penanggung jawab";
      toast.error(msg);
      return false;
    }
  };

  const handleEdit = async ({
    id,
    nama,
  }: {
    id: number;
    nama: string;
  }): Promise<boolean> => {
    setEditErrors(null);
    try {
      const result = await updatePenanggungJawabFn({ data: { id, nama } });
      toast.success(result?.message || "Penanggung jawab berhasil diperbarui");
      queryClient.invalidateQueries();
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as PenanggungJawabFormErrors;
      setEditErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui penanggung jawab";
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const result = await deletePenanggungJawabFn({ data: { id } });
      toast.success(result?.message || "Penanggung jawab berhasil dihapus");
      queryClient.invalidateQueries();
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus penanggung jawab";
      toast.error(msg);
      return false;
    }
  };

  return (
    <>
      <HeaderComp
        title="Pengaturan Penanggung Jawab"
        description="Kelola Penanggung Jawab"
        icon={<Plus />}
        actionLabel="Tambah PJ"
        onAction={() => setOpen(true)}
      />

      <PenanggungJawabAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
      />

      <SearchBar
        placeholder="Cari Penanggung Jawab..."
        className="mb-4"
        value={searchQuery}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <PenanggungJawabTable
        data={penanggungJawabQuery.data?.data ?? []}
        isLoading={penanggungJawabQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/penanggung-jawab",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/penanggung-jawab",
            search: (prev: any) => ({
              ...prev,
              per_page: newPageSize,
              page: 1,
            }),
            replace: true,
          });
        }}
        onUpdate={handleEdit}
        onDelete={handleDelete}
        editErrors={editErrors}
        onGetTransactions={async (id: number) => {
          const response = await getPenanggungJawabDetailFn({ data: { id } });
          const transaksi = response?.data?.transaksi || [];
          // Sort by date ascending (oldest first)
          return transaksi.sort((a, b) => a.date.localeCompare(b.date));
        }}
      />
    </>
  );
}
