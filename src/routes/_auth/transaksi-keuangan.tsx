import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import type { TransaksiKeuanganFormErrors } from "@/components/transaksi-keuangan/types";
import {
  MOCK_AKUN_OPTIONS,
  MOCK_KARYAWAN_OPTIONS,
  MOCK_KAS_OPTIONS,
  MOCK_PENANGGUNG_JAWAB_OPTIONS,
  MOCK_TRANSAKSI_KEUANGAN,
} from "@/components/transaksi-keuangan/types";

import { TransaksiKeuanganAddDialog } from "@/components/transaksi-keuangan/transaksi-keuangan-add-dialog";
import { TransaksiKeuanganTable } from "@/components/transaksi-keuangan/transaksi-keuangan-table";
import { TransaksiKeuanganFilterBar } from "@/components/transaksi-keuangan/transaksi-keuangan-filter-bar";
import { TransaksiKeuanganSummary } from "@/components/transaksi-keuangan/transaksi-keuangan-summary";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

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
const transaksiKeuanganSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.array(z.string()).catch(MOCK_KAS_OPTIONS.map((o) => o.nama)),
  akun: z.string().catch("all"),
  tipe: z.array(z.string()).catch(["pemasukan", "pengeluaran"]),
});

export const Route = createFileRoute("/_auth/transaksi-keuangan")({
  validateSearch: transaksiKeuanganSearchSchema,
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
    tipe: tipeFilter,
  } = search;

  // Mock data query
  const transaksiKeuanganQuery = useQuery({
    queryKey: [
      "transaksiKeuangan",
      {
        page,
        per_page,
        search: searchQuery,
        tanggal_mulai,
        tanggal_selesai,
        kas: kasFilter,
        akun: akunFilter,
        tipe: tipeFilter,
      },
    ],
    queryFn: () => {
      let filtered = MOCK_TRANSAKSI_KEUANGAN;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (t) =>
            t.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.akun_transaksi
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            t.penanggung_jawab
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      // Apply date range filter
      if (tanggal_mulai) {
        filtered = filtered.filter((t) => t.tanggal >= tanggal_mulai);
      }
      if (tanggal_selesai) {
        filtered = filtered.filter((t) => t.tanggal <= tanggal_selesai);
      }

      // Apply kas filter
      if (kasFilter.length === 0) {
        filtered = [];
      } else {
        filtered = filtered.filter((t) =>
          kasFilter.some((k) => t.kas.includes(k)),
        );
      }

      // Apply akun filter
      if (akunFilter && akunFilter !== "all") {
        filtered = filtered.filter((t) => t.akun_transaksi === akunFilter);
      }

      // Apply tipe filter
      if (tipeFilter.length > 0) {
        filtered = filtered.filter((t) => tipeFilter.includes(t.tipe));
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

  const karyawanDropdownQuery = useQuery({
    queryKey: ["karyawan", "dropdown"],
    queryFn: () => MOCK_KARYAWAN_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const penanggungJawabDropdownQuery = useQuery({
    queryKey: ["penanggungJawab", "dropdown"],
    queryFn: () => MOCK_PENANGGUNG_JAWAB_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = transaksiKeuanganQuery.data
    ? transaksiKeuanganQuery.data.total
    : 0;
  const pageCount = transaksiKeuanganQuery.data
    ? Math.max(
        1,
        Math.ceil(
          transaksiKeuanganQuery.data.total /
            transaksiKeuanganQuery.data.per_page,
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

  // Calculate totals based on filtered data
  const filteredData = transaksiKeuanganQuery.data?.data ?? [];
  const totalPemasukan = filteredData
    .filter((t) => t.tipe === "pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = filteredData
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<TransaksiKeuanganFormErrors>(null);
  const [editErrors, setEditErrors] =
    useState<TransaksiKeuanganFormErrors>(null);

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/transaksi-keuangan",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/transaksi-keuangan",
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
      to: "/transaksi-keuangan",
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
      to: "/transaksi-keuangan",
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
      to: "/transaksi-keuangan",
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
      to: "/transaksi-keuangan",
      search: (prev: any) => ({
        ...prev,
        akun: value === "all" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleTipeChange = (selectedTipes: Array<string>) => {
    navigate({
      to: "/transaksi-keuangan",
      search: (prev: any) => ({
        ...prev,
        tipe: selectedTipes.length === 0 ? undefined : selectedTipes,
        page: 1,
      }),
      replace: true,
    });
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleAdd = (_payload: {
    tanggal: string;
    deskripsi: string;
    akun_transaksi: string;
    penanggung_jawab: string;
    penginput: string;
    kas: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: string;
  }) => {
    setAddErrors(null);
    toast.success("Transaksi berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleEdit = (_params: {
    id: number;
    tanggal: string;
    deskripsi: string;
    akun_transaksi: string;
    penanggung_jawab: string;
    penginput: string;
    kas: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: string;
  }) => {
    setEditErrors(null);
    toast.success("Transaksi berhasil diperbarui");
    queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleDelete = (_id: number) => {
    toast.success("Transaksi berhasil dihapus");
    queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
    return true;
  };

  return (
    <>
      <HeaderComp
        title="Transaksi Keuangan"
        description="Lakukan Transaksi Keuangan"
        icon={<Plus />}
        actionLabel={"Lakukan Transaksi"}
        onAction={() => setOpen(true)}
      />

      <SearchBar
        placeholder="Cari Transaksi Keuangan..."
        className="mb-1"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <TransaksiKeuanganFilterBar
          tanggalMulai={tanggal_mulai}
          tanggalSelesai={tanggal_selesai}
          kas={kasFilter}
          akun={akunFilter}
          tipe={tipeFilter}
          onTanggalMulaiChange={handleTanggalMulaiChange}
          onTanggalSelesaiChange={handleTanggalSelesaiChange}
          onKasChange={handleKasChange}
          onAkunChange={handleAkunChange}
          onTipeChange={handleTipeChange}
          kasOptions={kasDropdownQuery.data ?? []}
          akunOptions={akunDropdownQuery.data ?? []}
          isLoading={transaksiKeuanganQuery.isLoading}
          className="flex-1"
        />
        <TransaksiKeuanganSummary
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
        />
      </div>

      <TransaksiKeuanganAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
        akunOptions={akunDropdownQuery.data ?? []}
        kasOptions={kasDropdownQuery.data ?? []}
        penanggungJawabOptions={penanggungJawabDropdownQuery.data ?? []}
      />

      <TransaksiKeuanganTable
        data={transaksiKeuanganQuery.data?.data ?? []}
        isLoading={transaksiKeuanganQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/transaksi-keuangan",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/transaksi-keuangan",
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
        kasOptions={kasDropdownQuery.data ?? []}
        penginputOptions={karyawanDropdownQuery.data ?? []}
        penanggungJawabOptions={penanggungJawabDropdownQuery.data ?? []}
      />
    </>
  );
}
