import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { PenanggungJawabFormErrors } from "@/components/penanggung-jawab/types";
import {
  MOCK_PENANGGUNG_JAWAB,
  MOCK_TRANSACTIONS_PJ,
} from "@/components/penanggung-jawab/types";

import { PenanggungJawabAddDialog } from "@/components/penanggung-jawab/penanggung-jawab-add-dialog";
import { PenanggungJawabTable } from "@/components/penanggung-jawab/penanggung-jawab-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

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
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const { page, per_page, search: searchQuery } = search;

  // Mock data query
  const penanggungJawabQuery = useQuery({
    queryKey: ["penanggungJawab", { page, per_page, search: searchQuery }],
    queryFn: () => {
      let filtered = MOCK_PENANGGUNG_JAWAB;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((p) =>
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      const total = filtered.length;
      const last_page = Math.max(1, Math.ceil(total / per_page));
      const current_page = Math.min(Math.max(1, page), last_page);
      const pageIndex = current_page - 1;
      const data = filtered.slice(
        pageIndex * per_page,
        pageIndex * per_page + per_page,
      );
      return {
        current_page,
        last_page,
        per_page,
        total,
        data,
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  const total = penanggungJawabQuery.data ? penanggungJawabQuery.data.total : 0;
  const pageCount = penanggungJawabQuery.data
    ? Math.max(
        1,
        Math.ceil(
          penanggungJawabQuery.data.total / penanggungJawabQuery.data.per_page,
        ),
      )
    : 1;
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<PenanggungJawabFormErrors>(null);
  const [editErrors, setEditErrors] = useState<PenanggungJawabFormErrors>(null);

  // Handle safe page navigation
  if (safePage !== page) {
    navigate({
      to: "/penanggung-jawab",
      search: (prev: any) => ({ ...prev, page: safePage }),
      replace: true,
    });
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

  // TODO: Ganti dengan API call ketika backend siap
  const handleAdd = (payload: { nama: string }) => {
    setAddErrors(null);
    toast.success("Penanggung jawab berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["penanggungJawab"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleEdit = ({ id, nama }: { id: number; nama: string }) => {
    setEditErrors(null);
    toast.success("Penanggung jawab berhasil diperbarui");
    queryClient.invalidateQueries({ queryKey: ["penanggungJawab"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleDelete = (id: number) => {
    toast.success("Penanggung jawab berhasil dihapus");
    queryClient.invalidateQueries({ queryKey: ["penanggungJawab"] });
    return true;
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
        className="mb-1"
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
        transactionsData={MOCK_TRANSACTIONS_PJ}
      />
    </>
  );
}
