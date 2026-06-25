import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { useServerFn } from "@tanstack/react-start";

import type { KasOption } from "@/components/laporan-keuangan/types";
import {
  downloadLaporanPDF,
  getLaporanKeuangan,
} from "@/services/laporanService";
import { getAkunDropdown } from "@/services/akunKeuanganService";
import { checkRole } from "@/utils/roleGuard";

import { LaporanKeuanganTransaksiTable } from "@/components/laporan-keuangan/laporan-keuangan-transaksi-table";
import { LaporanKeuanganMutasiTable } from "@/components/laporan-keuangan/laporan-keuangan-mutasi-table";
import { LaporanKeuanganPosisiTable } from "@/components/laporan-keuangan/laporan-keuangan-posisi-table";
import { LaporanKeuanganFilterBar } from "@/components/laporan-keuangan/laporan-keuangan-filter-bar";
import { LaporanKeuanganSummary } from "@/components/laporan-keuangan/laporan-keuangan-summary";
import HeaderComp from "@/components/shared/header-comp";

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
const laporanKeuanganSearchSchema = z.object({
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.string().catch("Kas Pemuda"),
  akun: z.string().catch("all"),
  tipe: z.array(z.string()).catch(["pemasukan", "pengeluaran"]),
});

export const Route = createFileRoute("/_auth/laporan-keuangan")({
  beforeLoad: async () => {
    const result = await checkRole({
      data: { allowedRoles: ["bendahara", "biasa"] },
    });
    if (!result.authorized) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  validateSearch: laporanKeuanganSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const {
    tanggal_mulai,
    tanggal_selesai,
    kas: kasFilter,
    akun: akunFilter,
    tipe: tipeFilter,
  } = search;

  // Server function for laporan
  const getLaporanKeuanganFn = useServerFn(getLaporanKeuangan);
  const getAkunDropdownFn = useServerFn(getAkunDropdown);

  // Query for laporan keuangan
  const laporanQuery = useQuery({
    queryKey: [
      "laporanKeuangan",
      {
        tanggal_mulai,
        tanggal_selesai,
        kas: kasFilter,
        akun: akunFilter,
        tipe: tipeFilter,
      },
    ],
    queryFn: async () => {
      const result = await getLaporanKeuanganFn({
        data: {
          params: {
            tanggal_mulai,
            tanggal_selesai,
            jenis_transaksi: tipeFilter as Array<"pemasukan" | "pengeluaran">,
            kas: kasFilter.toLowerCase(),
            akun:
              akunFilter && akunFilter !== "all"
                ? parseInt(akunFilter, 10)
                : null,
          },
        },
      });
      return result;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Query for akun dropdown - filter by kas from URL
  const akunQuery = useQuery({
    queryKey: ["akun", "dropdown", kasFilter],
    queryFn: async () => {
      const result = await getAkunDropdownFn({
        data: { kas: [kasFilter.toLowerCase()] },
      });
      if (!result?.data) return [];
      return result.data.map((a: { id: number; nama_akun: string }) => ({
        id: a.id,
        nama: a.nama_akun,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });

  // Kas options - hardcoded based on backend validation
  const kasOptions: Array<KasOption> = [
    { id: 1, nama: "Kas Pemuda" },
    { id: 2, nama: "17 an" },
  ];

  // Extract data from laporan response
  const laporanData = laporanQuery.data;
  const transaksiData = laporanData?.data?.transaksi ?? [];
  const mutasiData = laporanData?.data?.mutasi ?? [];
  const posisiData = laporanData?.data?.posisi_keuangan ?? [];
  const summary = laporanData?.summary ?? {
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo_awal: 0,
    kas_sekarang: 0,
  };

  const handleTanggalMulaiChange = (value: string) => {
    navigate({
      to: "/laporan-keuangan",
      search: (prev: any) => ({
        ...prev,
        tanggal_mulai: value === "" ? undefined : value,
      }),
      replace: true,
    });
  };

  const handleTanggalSelesaiChange = (value: string) => {
    navigate({
      to: "/laporan-keuangan",
      search: (prev: any) => ({
        ...prev,
        tanggal_selesai: value === "" ? undefined : value,
      }),
      replace: true,
    });
  };

  const handleAkunChange = (value: string) => {
    navigate({
      to: "/laporan-keuangan",
      search: (prev: any) => ({
        ...prev,
        akun: value === "all" ? undefined : value,
      }),
      replace: true,
    });
  };

  const handleTipeChange = (value: Array<string>) => {
    navigate({
      to: "/laporan-keuangan",
      search: (prev: any) => ({
        ...prev,
        tipe: value.length === 0 ? ["pemasukan", "pengeluaran"] : value,
      }),
      replace: true,
    });
  };

  const handleKasChange = (value: string) => {
    navigate({
      to: "/laporan-keuangan",
      search: (prev: any) => ({
        ...prev,
        kas: value === "all" ? undefined : value,
      }),
      replace: true,
    });
  };

  const downloadLaporanPDFFn = useServerFn(downloadLaporanPDF);

  const handlePrintPDF = async () => {
    try {
      const base64Data = await downloadLaporanPDFFn({
        data: {
          params: {
            tanggal_mulai,
            tanggal_selesai,
            jenis_transaksi: tipeFilter as Array<"pemasukan" | "pengeluaran">,
            kas: kasFilter.toLowerCase(),
            akun:
              akunFilter && akunFilter !== "all"
                ? parseInt(akunFilter, 10)
                : null,
          },
        },
      });

      if (!base64Data) {
        toast.error("Gagal mengambil data PDF");
        return;
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "laporan-keuangan.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengunduh PDF";
      toast.error(msg);
    }
  };

  return (
    <>
      <HeaderComp
        title="Laporan Keuangan"
        description="Laporan keuangan periode"
        icon={<Printer />}
        actionLabel="Print Laporan PDF"
        onAction={handlePrintPDF}
      />

      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <LaporanKeuanganFilterBar
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
          kasOptions={kasOptions}
          akunOptions={akunQuery.data ?? []}
          isLoading={laporanQuery.isLoading || akunQuery.isLoading}
          className="flex-1"
        />
        <LaporanKeuanganSummary
          saldoAwal={summary.saldo_awal}
          totalPemasukan={summary.total_pemasukan}
          totalPengeluaran={summary.total_pengeluaran}
          kasDiTangan={summary.kas_sekarang}
        />
      </div>

      <div className="flex flex-col gap-8">
        <LaporanKeuanganTransaksiTable
          data={transaksiData}
          isLoading={laporanQuery.isLoading}
          kasNama={kasFilter}
          tanggalMulai={tanggal_mulai}
          tanggalSelesai={tanggal_selesai}
        />

        <LaporanKeuanganMutasiTable
          data={mutasiData}
          isLoading={laporanQuery.isLoading}
          kasNama={kasFilter}
          tanggalMulai={tanggal_mulai}
          tanggalSelesai={tanggal_selesai}
        />

        <LaporanKeuanganPosisiTable
          data={posisiData}
          isLoading={laporanQuery.isLoading}
          kasNama={kasFilter}
          tanggalSelesai={tanggal_selesai}
        />
      </div>
    </>
  );
}
