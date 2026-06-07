import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_HISTORY_RIIL } from "@/components/history-riil/types";

import { HistoryRiilTable } from "@/components/history-riil/history-riil-table";
import { HistoryRiilFilterBar } from "@/components/history-riil/history-riil-filter-bar";
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
const historyRiilSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.string().optional(),
});

export const Route = createFileRoute("/_auth/history-riil")({
  validateSearch: historyRiilSearchSchema,
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
    kas,
  } = search;

  // Mock data query
  const historyRiilQuery = useQuery({
    queryKey: [
      "historyRiil",
      {
        page,
        per_page,
        search: searchQuery,
        tanggal_mulai,
        tanggal_selesai,
        kas,
      },
    ],
    queryFn: () => {
      let filtered = MOCK_HISTORY_RIIL;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((h) =>
          h.nama_akun.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Apply date range filter
      if (tanggal_mulai) {
        filtered = filtered.filter((h) => h.tanggal >= tanggal_mulai);
      }
      if (tanggal_selesai) {
        filtered = filtered.filter((h) => h.tanggal <= tanggal_selesai);
      }

      // Apply kas filter
      if (kas && kas !== "all") {
        filtered = filtered.filter((h) => h.kas === kas);
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

  const pageCount = historyRiilQuery.data
    ? Math.max(
        1,
        Math.ceil(historyRiilQuery.data.total / historyRiilQuery.data.per_page),
      )
    : 1;
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
  };

  // Handle safe page navigation
  if (safePage !== page) {
    navigate({
      to: "/history-riil",
      search: (prev: any) => ({ ...prev, page: safePage }),
      replace: true,
    });
  }

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/history-riil",
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
      to: "/history-riil",
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
      to: "/history-riil",
      search: (prev: any) => ({
        ...prev,
        tanggal_selesai: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleKasChange = (value: string) => {
    navigate({
      to: "/history-riil",
      search: (prev: any) => ({
        ...prev,
        kas: value === "all" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleVerify = (_id: number) => {
    toast.success("Data berhasil diverifikasi");
    queryClient.invalidateQueries({ queryKey: ["historyRiil"] });
    return true;
  };

  return (
    <>
      <HeaderComp
        title="History Riil"
        description="Berikut ini adalah riwayat uang riil"
      />

      <SearchBar
        placeholder="Cari History Riil..."
        className="mb-1"
        value={searchQuery}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <HistoryRiilFilterBar
        tanggalMulai={tanggal_mulai}
        tanggalSelesai={tanggal_selesai}
        kas={kas}
        onTanggalMulaiChange={handleTanggalMulaiChange}
        onTanggalSelesaiChange={handleTanggalSelesaiChange}
        onKasChange={handleKasChange}
        isLoading={historyRiilQuery.isLoading}
        className="mb-4"
      />

      <HistoryRiilTable
        data={historyRiilQuery.data?.data ?? []}
        isLoading={historyRiilQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/history-riil",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/history-riil",
            search: (prev: any) => ({
              ...prev,
              per_page: newPageSize,
              page: 1,
            }),
            replace: true,
          });
        }}
        onVerify={handleVerify}
      />
    </>
  );
}
