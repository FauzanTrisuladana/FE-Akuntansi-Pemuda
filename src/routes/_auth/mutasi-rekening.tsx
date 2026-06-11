import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { MutasiRekeningFormErrors } from "@/components/mutasi-rekening/types";
import {
  MOCK_AKUN_OPTIONS,
  MOCK_KAS_OPTIONS,
  MOCK_MUTASI_REKENING,
} from "@/components/mutasi-rekening/types";

import { MutasiRekeningAddDialog } from "@/components/mutasi-rekening/mutasi-rekening-add-dialog";
import { MutasiRekeningTable } from "@/components/mutasi-rekening/mutasi-rekening-table";
import { MutasiRekeningFilterBar } from "@/components/mutasi-rekening/mutasi-rekening-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getFirstDayOfMonth = (): string => {
  const now = new Date();
  return now
    .toISOString()
    .split("T")[0]
    .replace(/-\d{2}$/, `-01`);
};

const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

// ─── Search Params Schema ─────────────────────────────────────────────────────
const mutasiRekeningSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.array(z.string()).catch(MOCK_KAS_OPTIONS.map((o) => o.nama)),
  akun: z.string().optional(),
});

export const Route = createFileRoute("/_auth/mutasi-rekening")({
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

  // Mock data query
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
    queryFn: () => {
      let filtered = MOCK_MUTASI_REKENING;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (m) =>
            m.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.akun_debit.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.akun_kredit.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Apply date range filter
      if (tanggal_mulai) {
        filtered = filtered.filter((m) => m.tanggal >= tanggal_mulai);
      }
      if (tanggal_selesai) {
        filtered = filtered.filter((m) => m.tanggal <= tanggal_selesai);
      }

      // Apply kas filter
      if (kasFilter.length === 0) {
        filtered = [];
      } else {
        filtered = filtered.filter((m) => kasFilter.includes(m.kas));
      }

      // Apply akun filter
      if (akunFilter && akunFilter !== "all") {
        filtered = filtered.filter(
          (m) => m.akun_debit === akunFilter || m.akun_kredit === akunFilter,
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

  const akunDropdownQuery = useQuery({
    queryKey: ["akun", "dropdown"],
    queryFn: () => MOCK_AKUN_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const kasDropdownQuery = useQuery({
    queryKey: ["kas", "dropdown"],
    queryFn: () => MOCK_KAS_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = mutasiRekeningQuery.data ? mutasiRekeningQuery.data.total : 0;
  const pageCount = mutasiRekeningQuery.data
    ? Math.max(
        1,
        Math.ceil(
          mutasiRekeningQuery.data.total / mutasiRekeningQuery.data.per_page,
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
  const [addErrors, setAddErrors] = useState<MutasiRekeningFormErrors>(null);
  const [editErrors, setEditErrors] = useState<MutasiRekeningFormErrors>(null);

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/mutasi-rekening",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

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
      }),
      replace: true,
    });
  };

  const handleAkunChange = (value: string) => {
    navigate({
      to: "/mutasi-rekening",
      search: (prev: any) => ({
        ...prev,
        akun: value === "all" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleAdd = (_payload: {
    tanggal: string;
    akunDebit: string;
    akunKredit: string;
    jumlah: number;
    keterangan?: string;
  }) => {
    setAddErrors(null);
    toast.success("Mutasi akun berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleEdit = ({
    id: _id,
    tanggal: _tanggal,
    akunDebit: _akunDebit,
    akunKredit: _akunKredit,
    jumlah: _jumlah,
    keterangan: _keterangan,
  }: {
    id: number;
    tanggal: string;
    akunDebit: string;
    akunKredit: string;
    jumlah: number;
    keterangan?: string;
  }) => {
    setEditErrors(null);
    toast.success("Mutasi akun berhasil diperbarui");
    queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleDelete = (_id: number) => {
    toast.success("Mutasi akun berhasil dihapus");
    queryClient.invalidateQueries({ queryKey: ["mutasiRekening"] });
    return true;
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
        akunOptions={akunDropdownQuery.data ?? []}
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
