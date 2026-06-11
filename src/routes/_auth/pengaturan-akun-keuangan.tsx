import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import type { AkunKeuanganFormErrors } from "@/components/pengaturan-akun-keuangan/types";
import {
  MOCK_KAS_OPTIONS,
} from "@/components/pengaturan-akun-keuangan/types";
import { toAkunKeuanganRecord } from "@/components/pengaturan-akun-keuangan/types";

import { AkunKeuanganAddDialog } from "@/components/pengaturan-akun-keuangan/akun-keuangan-add-dialog";
import { AkunKeuanganTable } from "@/components/pengaturan-akun-keuangan/akun-keuangan-table";
import { AkunKeuanganFilterBar } from "@/components/pengaturan-akun-keuangan/akun-keuangan-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  getAkunKeuangan,
  createAkunKeuangan,
  updateAkunKeuangan,
  deleteAkunKeuangan,
  getAkunKeuanganDetail,
} from "@/services/akunKeuanganService";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const akunKeuanganSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  kas: z.array(z.string()).catch(MOCK_KAS_OPTIONS.map((o) => o.nama)),
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

  // API functions
  const getAkunKeuanganFn = useServerFn(getAkunKeuangan);
  const createAkunKeuanganFn = useServerFn(createAkunKeuangan);
  const updateAkunKeuanganFn = useServerFn(updateAkunKeuangan);
  const deleteAkunKeuanganFn = useServerFn(deleteAkunKeuangan);
  const getAkunKeuanganDetailFn = useServerFn(getAkunKeuanganDetail);

  const akunKeuanganQuery = useQuery({
    queryKey: [
      "akunKeuangan",
      { page, per_page, search: searchQuery, kas: kasFilter },
    ],
    queryFn: async () => {
      const response = await getAkunKeuanganFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            kas: kasFilter.length > 0 ? kasFilter : undefined,
          },
        },
      });
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  const kasDropdownQuery = useQuery({
    queryKey: ["kas", "dropdown"],
    queryFn: () => MOCK_KAS_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = akunKeuanganQuery.data?.meta?.total ?? 0;
  const pageCount = akunKeuanganQuery.data?.meta?.last_page ?? 1;
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

  // API handlers
  const handleAdd = async (payload: {
    namaAkun: string;
    kasId: number;
    keterangan?: string;
  }) => {
    setAddErrors(null);
    try {
      await createAkunKeuanganFn({
        data: {
          nama_akun: payload.namaAkun,
          kas: MOCK_KAS_OPTIONS.find((k) => k.id === payload.kasId)?.nama ?? "",
          keterangan: payload.keterangan,
        },
      });
      toast.success("Akun keuangan berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
      return true;
    } catch {
      toast.error("Gagal membuat akun keuangan");
      return false;
    }
  };

  const handleEdit = async ({
    id,
    kasId,
    keterangan,
  }: {
    id: number;
    kasId: number;
    keterangan?: string;
  }) => {
    setEditErrors(null);
    try {
      await updateAkunKeuanganFn({
        data: {
          id,
          kas: MOCK_KAS_OPTIONS.find((k) => k.id === kasId)?.nama,
          keterangan,
        },
      });
      toast.success("Akun keuangan berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
      return true;
    } catch {
      toast.error("Gagal memperbarui akun keuangan");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAkunKeuanganFn({ data: { id } });
      toast.success("Akun keuangan berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["akunKeuangan"] });
      return true;
    } catch {
      toast.error("Gagal menghapus akun keuangan");
      return false;
    }
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
        placeholder="Cari Akun Keuangan..."
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
