import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { AkunKeuanganFormErrors } from "@/components/pengaturan-akun-keuangan/types";
import {
  MOCK_AKUN_KEUANGAN,
  MOCK_KAS_OPTIONS,
  MOCK_TRANSACTIONS,
} from "@/components/pengaturan-akun-keuangan/types";

import { AkunKeuanganAddDialog } from "@/components/pengaturan-akun-keuangan/akun-keuangan-add-dialog";
import { AkunKeuanganTable } from "@/components/pengaturan-akun-keuangan/akun-keuangan-table";
import { AkunKeuanganFilterBar } from "@/components/pengaturan-akun-keuangan/akun-keuangan-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const akunKeuanganSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  kas: z
    .array(z.string())
    .catch(MOCK_KAS_OPTIONS.map((o) => o.nama))
    .default(MOCK_KAS_OPTIONS.map((o) => o.nama)),
});

export const Route = createFileRoute("/_auth/pengaturan-akun-keuangan")({
  validateSearch: akunKeuanganSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const { page, per_page, search: searchQuery, kas: kasFilter } = search;

  // Mock data query
  const akunKeuanganQuery = useQuery({
    queryKey: [
      "akunKeuangan",
      { page, per_page, search: searchQuery, kas: kasFilter },
    ],
    queryFn: () => {
      let filtered = MOCK_AKUN_KEUANGAN;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (a) =>
            a.namaAkun.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.kas.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.keterangan ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      if (kasFilter.length === 0) {
        filtered = [];
      } else {
        filtered = filtered.filter((a) => kasFilter.includes(a.kas));
      }

      const total = filtered.length;
      const last_page = Math.max(1, Math.ceil(total / per_page));
      const current_page = Math.min(Math.max(1, page), last_page);
      const start = (current_page - 1) * per_page;
      const data = filtered.slice(start, start + per_page);
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

  const kasDropdownQuery = useQuery({
    queryKey: ["kas", "dropdown"],
    queryFn: () => MOCK_KAS_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = akunKeuanganQuery.data ? akunKeuanganQuery.data.total : 0;
  const pageCount = akunKeuanganQuery.data
    ? Math.max(
        1,
        Math.ceil(
          akunKeuanganQuery.data.total / akunKeuanganQuery.data.per_page,
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
  const [addErrors, setAddErrors] = useState<AkunKeuanganFormErrors>(null);
  const [editErrors, setEditErrors] = useState<AkunKeuanganFormErrors>(null);

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/pengaturan-akun-keuangan",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/pengaturan-akun-keuangan",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleKasFilterChange = (selectedKas: Array<string>) => {
    navigate({
      to: "/pengaturan-akun-keuangan",
      search: (prev: any) => ({
        ...prev,
        kas: selectedKas,
        page: 1,
      }),
      replace: true,
    });
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleAdd = (payload: {
    namaAkun: string;
    kasId: number;
    keterangan?: string;
  }) => {
    setAddErrors(null);
    toast.success("Akun keuangan berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleEdit = ({ id, kasId }: { id: number; kasId: number }) => {
    setEditErrors(null);
    toast.success("Akun keuangan berhasil diperbarui");
    queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleDelete = (id: number) => {
    toast.success("Akun keuangan berhasil dihapus");
    queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
    return true;
  };

  return (
    <>
      <HeaderComp
        title="Pengaturan Akun Keuangan"
        description="Kelola Akun Keuangan"
        icon={<Plus />}
        actionLabel={"Tambah Akun"}
        onAction={() => setOpen(true)}
      />

      <AkunKeuanganAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
        kasOptions={kasDropdownQuery.data ?? []}
      />

      <SearchBar
        placeholder="Akun Keuangan..."
        className="mb-1"
        value={searchQuery}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <AkunKeuanganFilterBar
        kasOptions={kasDropdownQuery.data ?? []}
        onKasFilterChange={handleKasFilterChange}
        defaultSelectedKas={kasFilter}
        isLoading={akunKeuanganQuery.isLoading}
        className="mb-4"
      />

      <AkunKeuanganTable
        data={akunKeuanganQuery.data?.data ?? []}
        isLoading={akunKeuanganQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/pengaturan-akun-keuangan",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/pengaturan-akun-keuangan",
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
        kasOptions={kasDropdownQuery.data ?? []}
        transactionsData={MOCK_TRANSACTIONS}
      />
    </>
  );
}
