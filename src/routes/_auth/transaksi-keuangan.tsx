import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { useServerFn } from "@tanstack/react-start";
import type {
  SerializedFile,
  TransaksiCollectionResponse,
} from "@/services/transaksiService";
import type {
  TransaksiKeuanganFormErrors,
  TransaksiKeuanganRecord,
} from "@/components/transaksi-keuangan/types";
import {
  MOCK_KAS_OPTIONS,
  toTransaksiKeuanganRecord,
} from "@/components/transaksi-keuangan/types";
import {
  createTransaksiKeuangan,
  deleteTransaksiKeuangan,
  getTransaksiKeuangan,
  updateTransaksiKeuangan,
} from "@/services/transaksiService";
import { getAkunDropdown } from "@/services/akunKeuanganService";
import { getPenanggungJawabDropdown } from "@/services/penanggungJawabService";
import { checkRole } from "@/utils/roleGuard";

import { TransaksiKeuanganAddDialog } from "@/components/transaksi-keuangan/transaksi-keuangan-add-dialog";
import { TransaksiKeuanganTable } from "@/components/transaksi-keuangan/transaksi-keuangan-table";
import { TransaksiKeuanganFilterBar } from "@/components/transaksi-keuangan/transaksi-keuangan-filter-bar";
import { TransaksiKeuanganSummary } from "@/components/transaksi-keuangan/transaksi-keuangan-summary";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

// Helper to convert File to a serializable format for server function boundary
const fileToSerializedFile = (file: File): Promise<SerializedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      const base64 = result.split(",")[1];
      resolve({ base64, name: file.name, type: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  kas: z.array(z.enum(["17 an", "kas pemuda"])).catch(["17 an", "kas pemuda"]),
  akun: z.number().nullable().catch(null),
  tipe: z
    .array(z.enum(["pemasukan", "pengeluaran"]))
    .catch(["pemasukan", "pengeluaran"]),
});

export const Route = createFileRoute("/_auth/transaksi-keuangan")({
  beforeLoad: async () => {
    const result = await checkRole({ data: { allowedRoles: ["bendahara"] } });
    if (!result.authorized) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  validateSearch: transaksiKeuanganSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const transaksiKeuanganFn = useServerFn(getTransaksiKeuangan);
  const createTransaksiFn = useServerFn(createTransaksiKeuangan);
  const updateTransaksiFn = useServerFn(updateTransaksiKeuangan);
  const deleteTransaksiFn = useServerFn(deleteTransaksiKeuangan);
  const akunDropdownFn = useServerFn(getAkunDropdown);
  const penanggungJawabDropdownFn = useServerFn(getPenanggungJawabDropdown);

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

  // API query for transaksi keuangan
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
    queryFn: async () => {
      const result = await transaksiKeuanganFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            tanggal_mulai,
            tanggal_selesai,
            kas: kasFilter,
            akun: akunFilter,
            jenis_transaksi: tipeFilter,
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
        data: (result as any).data.map(toTransaksiKeuanganRecord),
        summary: (result as any).summary,
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  // Akun dropdown query - filter by kas from URL
  const akunDropdownQuery = useQuery({
    queryKey: ["akun", "dropdown", kasFilter],
    queryFn: async () => {
      const result = await akunDropdownFn({ data: { kas: kasFilter } });
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

  const penanggungJawabDropdownQuery = useQuery({
    queryKey: ["penanggungJawab", "dropdown"],
    queryFn: async () => {
      const result = await penanggungJawabDropdownFn({ data: {} });
      if (!result?.data) return [];
      return result.data.map((p: { id: number; nama: string }) => ({
        id: p.id,
        nama: p.nama,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });

  const total = transaksiKeuanganQuery.data?.meta?.total ?? 0;
  const pageCount = transaksiKeuanganQuery.data?.meta?.last_page ?? 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  // Data already mapped in queryFn
  const mappedData = (transaksiKeuanganQuery.data?.data ??
    []) as Array<TransaksiKeuanganRecord>;
  const totalPemasukan =
    (transaksiKeuanganQuery.data as TransaksiCollectionResponse)?.summary
      ?.total_pemasukan ?? 0;
  const totalPengeluaran =
    (transaksiKeuanganQuery.data as TransaksiCollectionResponse)?.summary
      ?.total_pengeluaran ?? 0;

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<TransaksiKeuanganFormErrors>(null);
  const [editErrors, setEditErrors] =
    useState<TransaksiKeuanganFormErrors>(null);

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
        akun: null,
      }),
      replace: true,
    });
  };

  const handleAkunChange = (value: string) => {
    navigate({
      to: "/transaksi-keuangan",
      search: (prev: any) => ({
        ...prev,
        akun: value === "all" ? null : parseInt(value, 10),
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

  // API call handlers
  const handleAdd = async (payload: {
    tanggal: string;
    deskripsi: string;
    akun_id: number;
    penanggung_jawab_id?: number;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: File | null;
  }) => {
    setAddErrors(null);
    try {
      let serializedBukti: SerializedFile | undefined;
      if (payload.bukti) {
        serializedBukti = await fileToSerializedFile(payload.bukti);
      }

      await createTransaksiFn({
        data: {
          date: payload.tanggal,
          deskripsi: payload.deskripsi || undefined,
          jenis_transaksi: payload.tipe,
          akun_id: payload.akun_id,
          penanggung_jawab_id: payload.penanggung_jawab_id,
          jumlah: payload.jumlah,
          bukti: serializedBukti,
        },
      });
      toast.success("Transaksi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
      return true;
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setAddErrors(error.response.data.errors);
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menambahkan transaksi";
      toast.error(msg);
      return false;
    }
  };

  const handleEdit = async (params: {
    id: number;
    tanggal: string;
    deskripsi: string;
    akun_id: number;
    penanggung_jawab_id?: number;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    bukti?: File | null;
  }) => {
    setEditErrors(null);
    try {
      let serializedBukti: SerializedFile | undefined;
      if (params.bukti) {
        serializedBukti = await fileToSerializedFile(params.bukti);
      }

      await updateTransaksiFn({
        data: {
          id: params.id,
          date: params.tanggal,
          deskripsi: params.deskripsi || undefined,
          jenis_transaksi: params.tipe,
          akun_id: params.akun_id,
          penanggung_jawab_id: params.penanggung_jawab_id,
          jumlah: params.jumlah,
          bukti: serializedBukti,
        },
      });
      toast.success("Transaksi berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
      return true;
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui transaksi";
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaksiFn({ data: { id } });
      toast.success("Transaksi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["transaksiKeuangan"] });
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus transaksi";
      toast.error(msg);
      return false;
    }
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
        kasOptions={kasDropdownQuery.data ?? []}
        penanggungJawabOptions={penanggungJawabDropdownQuery.data ?? []}
      />

      <TransaksiKeuanganTable
        data={mappedData}
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
        kasOptions={kasDropdownQuery.data ?? []}
        penanggungJawabOptions={penanggungJawabDropdownQuery.data ?? []}
      />
    </>
  );
}
