import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { KAS_OPTIONS, toHistoryRiilRecord } from "@/components/history-riil/types";

import { HistoryRiilTable } from "@/components/history-riil/history-riil-table";
import { HistoryRiilFilterBar } from "@/components/history-riil/history-riil-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import { getHistoryRiil, verifyHistoryRiil } from "@/services/historyRiilService";

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
  kas: z.array(z.string()).catch(KAS_OPTIONS.map((o) => o.nama)),
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

  const getHistoryRiilFn = useServerFn(getHistoryRiil);
  const verifyHistoryRiilFn = useServerFn(verifyHistoryRiil);

  // API data query
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
    queryFn: async () => {
      const result = await getHistoryRiilFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            tanggal_mulai,
            tanggal_selesai,
            kas,
          },
        },
      });
      if (!result) return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
      return {
        ...result,
        data: result.data.map(toHistoryRiilRecord),
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  const pageCount = historyRiilQuery.data?.meta
    ? Math.max(
        1,
        Math.ceil(historyRiilQuery.data.meta.total / historyRiilQuery.data.meta.per_page),
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

  const handleKasChange = (selectedKas: Array<string>) => {
    navigate({
      to: "/history-riil",
      search: (prev: any) => ({
        ...prev,
        kas: selectedKas,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleVerify = async (id: number) => {
    try {
      await verifyHistoryRiilFn({ data: { id } });
      toast.success("Data berhasil diverifikasi");
      queryClient.invalidateQueries({ queryKey: ["historyRiil"] });
      return true;
    } catch {
      toast.error("Gagal memverifikasi data");
      return false;
    }
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
        kasOptions={KAS_OPTIONS}
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
