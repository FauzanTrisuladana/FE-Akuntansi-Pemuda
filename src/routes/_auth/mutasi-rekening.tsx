import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { format, toZonedTime } from "date-fns-tz";
import type { MutasiRekeningFormErrors } from "@/components/mutasi-rekening/types";
import {
  MOCK_KAS_OPTIONS,
  toMutasiRekeningRecord,
} from "@/components/mutasi-rekening/types";
import { checkRole } from "@/utils/roleGuard";

import { MutasiRekeningAddDialog } from "@/components/mutasi-rekening/mutasi-rekening-add-dialog";
import { MutasiRekeningTable } from "@/components/mutasi-rekening/mutasi-rekening-table";
import { MutasiRekeningFilterBar } from "@/components/mutasi-rekening/mutasi-rekening-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  createMutasiRekening,
  deleteMutasiRekening,
  getMutasiRekening,
  updateMutasiRekening,
} from "@/services/mutasiRekeningService";
import { getAkunDropdown } from "@/services/akunKeuanganService";

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getFirstDayOfMonth = (): string => {
  const now = new Date();
  const jakartaTime = toZonedTime(now, "Asia/Jakarta");
  return format(jakartaTime, "yyyy-MM-01");
};

const getToday = (): string => {
  const now = new Date();
  const jakartaTime = toZonedTime(now, "Asia/Jakarta");
  return format(jakartaTime, "yyyy-MM-dd");
};

// ─── Search Params Schema ─────────────────────────────────────────────────────
const mutasiRekeningSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.array(z.string()).catch(MOCK_KAS_OPTIONS.map((o) => o.nama)),
  akun: z.number().optional(),
});

export const Route = createFileRoute("/_auth/mutasi-rekening")({
  beforeLoad: async () => {
    const result = await checkRole({ data: { allowedRoles: ["bendahara"] } });
    if (!result.authorized) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  validateSearch: mutasiRekeningSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const {
    page,
    per_page,
    search: searchQuery,
    tanggal_mulai,
    tanggal_selesai,
    kas: kasFilter,
    akun: akunFilter,
  } = search;

  const getMutasiRekeningFn = useServerFn(getMutasiRekening);
  const createMutasiRekeningFn = useServerFn(createMutasiRekening);
  const updateMutasiRekeningFn = useServerFn(updateMutasiRekening);
  const deleteMutasiRekeningFn = useServerFn(deleteMutasiRekening);
  const getAkunDropdownFn = useServerFn(getAkunDropdown);

  // API data query
  const mutasiRekeningQuery = useQuery({
    queryKey: [
      "mutasiRekening",
      {
        page,
        per_page,
        search: searchQuery,
        tanggal_mulai,
        tanggal_selesai,
        kas: kasFilter,
        akun: akunFilter,
      },
    ],
    queryFn: async () => {
      const result = await getMutasiRekeningFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            tanggal_mulai,
            tanggal_selesai,
            kas: kasFilter,
            akun: akunFilter,
          },
        },
      });
      if (!result)
        return {
          data: [],
          meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
        };
      return {
        ...result,
        data: result.data.map(toMutasiRekeningRecord),
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  // Akun dropdown query - filter by kas from URL
  const akunDropdownQuery = useQuery({
    queryKey: ["akun", "dropdown", kasFilter],
    queryFn: async () => {
      const result = await getAkunDropdownFn({ data: { kas: kasFilter } });
      if (!result?.data) return [];
      return result.data.map((a: { id: number; nama_akun: string }) => ({
        id: a.id,
        nama: a.nama_akun,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });

  const kasDropdownQuery = useQuery({
    queryKey: ["kas", "dropdown"],
    queryFn: () => MOCK_KAS_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = mutasiRekeningQuery.data?.meta?.total ?? 0;
  const pageCount = mutasiRekeningQuery.data?.meta
    ? Math.max(
        1,
        Math.ceil(
          mutasiRekeningQuery.data.meta.total /
            mutasiRekeningQuery.data.meta.per_page,
        ),
      )
    : 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<MutasiRekeningFormErrors>(null);
  const [editErrors, setEditErrors] = useState<MutasiRekeningFormErrors>(null);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleTanggalMulaiChange = (value: string) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        tanggal_mulai: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleTanggalSelesaiChange = (value: string) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        tanggal_selesai: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleKasChange = (selectedKas: Array<string>) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        kas: selectedKas,
        page: 1,
        akun: undefined,
      }),
      replace: true,
    });
  };

  const handleAkunChange = (value: number | undefined) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        akun: value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleAdd = async (payload: {
    tanggal: string;
    akunDebit: number;
    akunKredit: number;
    jumlah: number;
    keterangan?: string;
    kas: string;
  }) => {
    setAddErrors(null);
    try {
      const result = await createMutasiRekeningFn({
        data: {
          akun_debit_id: payload.akunDebit,
          akun_kredit_id: payload.akunKredit,
          date: payload.tanggal,
          jumlah: payload.jumlah,
          keterangan: payload.keterangan,
          kas: payload.kas,
        },
      });
      toast.success(result?.message || "Mutasi akun berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as MutasiRekeningFormErrors;
      setAddErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menambahkan mutasi akun";
      toast.error(msg);
      return false;
    }
  };

  const handleEdit = async ({
    id,
    tanggal,
    akunDebit,
    akunKredit,
    jumlah,
    keterangan,
  }: {
    id: number;
    tanggal: string;
    akunDebit: number;
    akunKredit: number;
    jumlah: number;
    keterangan?: string;
  }) => {
    setEditErrors(null);
    try {
      const result = await updateMutasiRekeningFn({
        data: {
          id,
          date: tanggal,
          akun_debit_id: akunDebit,
          akun_kredit_id: akunKredit,
          jumlah,
          keterangan,
        },
      });
      toast.success(result?.message || "Mutasi akun berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as MutasiRekeningFormErrors;
      setEditErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui mutasi akun";
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMutasiRekeningFn({ data: { id } });
      toast.success(result?.message || "Mutasi akun berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus mutasi akun";
      toast.error(msg);
      return false;
    }
  };

  return (
    <>
      <HeaderComp
        title="Mutasi Akun"
        description="Lakukan Transaksi antar akun di kas yang sama"
        icon={<Plus />}
        actionLabel={"Lakukan Mutasi Akun"}
        onAction={() => setOpen(true)}
      />

      <SearchBar
        placeholder="Cari Mutasi Akun..."
        className="mb-1"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <MutasiRekeningFilterBar
        tanggalMulai={tanggal_mulai}
        tanggalSelesai={tanggal_selesai}
        kas={kasFilter}
        akun={akunFilter}
        onTanggalMulaiChange={handleTanggalMulaiChange}
        onTanggalSelesaiChange={handleTanggalSelesaiChange}
        onKasChange={handleKasChange}
        onAkunChange={handleAkunChange}
        kasOptions={kasDropdownQuery.data ?? []}
        akunOptions={akunDropdownQuery.data ?? []}
        isLoading={mutasiRekeningQuery.isLoading}
        className="mb-4"
      />

      <MutasiRekeningAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
        kasOptions={kasDropdownQuery.data ?? []}
      />

      <MutasiRekeningTable
        data={mutasiRekeningQuery.data?.data ?? []}
        isLoading={mutasiRekeningQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/mutasi-rekening",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/mutasi-rekening",
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
        akunOptions={akunDropdownQuery.data ?? []}
      />
    </>
  );
}
