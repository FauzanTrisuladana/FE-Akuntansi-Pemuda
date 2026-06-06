import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { UserFormErrors } from "@/components/users/types";
import { MOCK_ROLE_OPTIONS, MOCK_USERS } from "@/components/users/types";

import { UserAddDialog } from "@/components/users/user-add-dialog";
import { UsersTable } from "@/components/users/users-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/users")({
  validateSearch: usersSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const { page, per_page, search: searchQuery } = search;

  // Mock data query
  const usersQuery = useQuery({
    queryKey: ["users", { page, per_page, search: searchQuery }],
    queryFn: () => {
      const filtered = searchQuery
        ? MOCK_USERS.filter(
            (u) =>
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (u.peran ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : MOCK_USERS;
      const total = filtered.length;
      const last_page = Math.max(1, Math.ceil(total / per_page));
      const current_page = Math.min(Math.max(1, page), last_page);
      const start = (current_page - 1) * per_page;
      const data = filtered.slice(start, start + per_page);
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

  const roleDropdownQuery = useQuery({
    queryKey: ["role", "dropdown"],
    queryFn: () => MOCK_ROLE_OPTIONS,
    staleTime: 1000 * 60 * 10,
  });

  const total = usersQuery.data ? usersQuery.data.total : 0;
  const pageCount = usersQuery.data
    ? Math.max(1, Math.ceil(usersQuery.data.total / usersQuery.data.per_page))
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
  const [addErrors, setAddErrors] = useState<UserFormErrors>(null);
  const [editErrors, setEditErrors] = useState<UserFormErrors>(null);

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/users",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/users",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleAdd = (payload: {
    name: string;
    username: string;
    email: string;
    role_id: number;
  }) => {
    setAddErrors(null);
    toast.success("User berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleEdit = ({
    id,
    role_id,
  }: {
    id: number;
    role_id: number;
  }) => {
    setEditErrors(null);
    toast.success("User berhasil diperbarui");
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleDelete = (id: number) => {
    toast.success("User berhasil dihapus");
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return true;
  };

  // TODO: Ganti dengan API call ketika backend siap
  const handleToggleStatus = (id: number, nextActive: boolean) => {
    toast.success(
      nextActive ? "User berhasil diaktifkan" : "User berhasil dinon-aktifkan",
    );
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return true;
  };

  return (
    <>
      <HeaderComp
        title="Manajemen User"
        description="Kelola data pengguna sistem"
        icon={<Plus />}
        actionLabel={"Tambah User"}
        onAction={() => setOpen(true)}
      />

      <UserAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
        roleOptions={roleDropdownQuery.data ?? []}
      />

      <SearchBar
        placeholder="Cari pengguna..."
        className="mb-4"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <UsersTable
        data={usersQuery.data?.data ?? []}
        isLoading={usersQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/users",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/users",
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
        onToggleStatus={handleToggleStatus}
        editErrors={editErrors}
        roleOptions={roleDropdownQuery.data ?? []}
      />
    </>
  );
}
