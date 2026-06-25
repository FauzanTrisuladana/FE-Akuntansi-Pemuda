import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format, toZonedTime } from "date-fns-tz";
import { toHistoryRiilRecord } from "@/components/history-riil/types";
import { KAS_OPTIONS } from "@/components/shared/mock-data";
import { useRoleGuard } from "@/utils/roleGuard";

import { HistoryRiilTable } from "@/components/history-riil/history-riil-table";
import { HistoryRiilFilterBar } from "@/components/history-riil/history-riil-filter-bar";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  getHistoryRiil,
  verifyHistoryRiil,
} from "@/services/historyRiilService";

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
  const { authorized, isLoading } = useRoleGuard(["bendahara"]);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const getHistoryRiilFn = useServerFn(getHistoryRiil);
  const verifyHistoryRiilFn = useServerFn(verifyHistoryRiil);

  const {
    page,
    per_page,
    search: searchQuery,
    tanggal_mulai,
    tanggal_selesai,
    kas,
  } = search;

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
      if (!result)
        return {
          data: [],
          meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
        };
      return {
        ...result,
        data: result.data.map(toHistoryRiilRecord),
      };
    },
    staleTime: 1000 * 60 * 2,
    enabled: authorized && !isLoading,
  });

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

  const pageCount = historyRiilQuery.data?.meta
    ? Math.max(
        1,
        Math.ceil(
          historyRiilQuery.data.meta.total /
            historyRiilQuery.data.meta.per_page,
        ),
      )
    : 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
  };

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
      const result = await verifyHistoryRiilFn({ data: { id } });
      toast.success(result?.message || "Data berhasil diverifikasi");
      queryClient.invalidateQueries({ queryKey: ["historyRiil"] });
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memverifikasi data";
      toast.error(msg);
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
