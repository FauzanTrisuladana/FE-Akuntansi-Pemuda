import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";

import {
  MOCK_AKUN_OPTIONS,
  MOCK_KAS_OPTIONS,
  MOCK_LAPORAN_MUTASI,
  MOCK_LAPORAN_POSISI,
  MOCK_LAPORAN_TRANSAKSI,
} from "@/components/laporan-keuangan/types";

import { LaporanKeuanganTransaksiTable } from "@/components/laporan-keuangan/laporan-keuangan-transaksi-table";
import { LaporanKeuanganMutasiTable } from "@/components/laporan-keuangan/laporan-keuangan-mutasi-table";
import { LaporanKeuanganPosisiTable } from "@/components/laporan-keuangan/laporan-keuangan-posisi-table";
import { LaporanKeuanganFilterBar } from "@/components/laporan-keuangan/laporan-keuangan-filter-bar";
import { LaporanKeuanganSummary } from "@/components/laporan-keuangan/laporan-keuangan-summary";
import HeaderComp from "@/components/shared/header-comp";

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
const laporanKeuanganSearchSchema = z.object({
  tanggal_mulai: z.string().catch(getFirstDayOfMonth()),
  tanggal_selesai: z.string().catch(getToday()),
  kas: z.string().catch("Kas Pemuda"),
  akun: z.string().catch("all"),
  tipe: z.array(z.string()).catch(["pemasukan", "pengeluaran"]),
});

export const Route = createFileRoute("/_auth/laporan-keuangan")({
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

  // Mock data query for transaksi keuangan
  const transaksiQuery = useQuery({
    queryKey: [
      "laporanTransaksi",
      { tanggal_mulai, tanggal_selesai, akun: akunFilter, tipe: tipeFilter },
    ],
    queryFn: () => {
      let filtered = MOCK_LAPORAN_TRANSAKSI;

      // Apply date range filter
      if (tanggal_mulai) {
        filtered = filtered.filter((t) => t.tanggal >= tanggal_mulai);
      }
      if (tanggal_selesai) {
        filtered = filtered.filter((t) => t.tanggal <= tanggal_selesai);
      }

      // Apply akun filter
      if (akunFilter && akunFilter !== "all") {
        filtered = filtered.filter((t) => t.akun_transaksi === akunFilter);
      }

      // Apply tipe filter (array)
      if (tipeFilter.length > 0 && !tipeFilter.includes("all")) {
        filtered = filtered.filter((t) => tipeFilter.includes(t.tipe));
      }

      return filtered;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Mock data query for mutasi kas
  const mutasiQuery = useQuery({
    queryKey: ["laporanMutasi"],
    queryFn: () => MOCK_LAPORAN_MUTASI,
    staleTime: 1000 * 60 * 2,
  });

  // Mock data query for posisi keuangan
  const posisiQuery = useQuery({
    queryKey: ["laporanPosisi"],
    queryFn: () => MOCK_LAPORAN_POSISI,
    staleTime: 1000 * 60 * 2,
  });

  // Calculate totals for summary
  const transaksiData = transaksiQuery.data ?? [];
  const totalPemasukan = transaksiData
    .filter((t) => t.tipe === "pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = transaksiData
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);

  // Calculate saldo awal from posisi data
  const posisiData = posisiQuery.data ?? [];
  const saldoAwal = posisiData.reduce((sum, p) => sum + p.saldo_awal, 0);
  const kasDiTangan = posisiData.reduce((sum, p) => sum + p.total, 0);

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

  const handlePrintPDF = () => {
    // TODO: Implement PDF print functionality
    console.log("Print PDF clicked");
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
          kasOptions={MOCK_KAS_OPTIONS}
          akunOptions={MOCK_AKUN_OPTIONS}
          isLoading={transaksiQuery.isLoading}
          className="flex-1"
        />
        <LaporanKeuanganSummary
          saldoAwal={saldoAwal}
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
          kasDiTangan={kasDiTangan}
        />
      </div>

      <div className="flex flex-col gap-8">
        <LaporanKeuanganTransaksiTable
          data={transaksiQuery.data ?? []}
          isLoading={transaksiQuery.isLoading}
          kasNama={kasFilter}
          tanggalMulai={tanggal_mulai}
          tanggalSelesai={tanggal_selesai}
        />

        <LaporanKeuanganMutasiTable
          data={mutasiQuery.data ?? []}
          isLoading={mutasiQuery.isLoading}
          kasNama={kasFilter}
          tanggalMulai={tanggal_mulai}
          tanggalSelesai={tanggal_selesai}
        />

        <LaporanKeuanganPosisiTable
          data={posisiQuery.data ?? []}
          isLoading={posisiQuery.isLoading}
          kasNama={kasFilter}
          tanggalSelesai={tanggal_selesai}
        />
      </div>
    </>
  );
}
