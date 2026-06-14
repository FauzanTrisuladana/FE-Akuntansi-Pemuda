import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FilterBar } from "src/components/users/filter-bar-user";
import { useServerFn } from "@tanstack/react-start";
import type { UserFormErrors } from "@/components/users/types";
import { ROLE_OPTIONS } from "@/components/users/types";

import { UserAddDialog } from "@/components/users/user-add-dialog";
import { UsersTable } from "@/components/users/users-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  createUser,
  deleteUser,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "@/services/userService";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  role: z.array(z.string()).catch(ROLE_OPTIONS.map((o) => o.name)),
  status: z.array(z.string()).catch(["Aktif", "Pending", "Tidak Aktif"]),
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

  const {
    page,
    per_page,
    search: searchQuery,
    role: roleFilter,
    status: statusFilter,
  } = search;

  // API query
  const getUsersFn = useServerFn(getUsers);
  const usersQuery = useQuery({
    queryKey: [
      "users",
      {
        page,
        per_page,
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
      },
    ],
    queryFn: async () => {
      const response = await getUsersFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            role: roleFilter,
            status: statusFilter,
          },
        },
      });
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  const total = usersQuery.data ? usersQuery.data.meta.total : 0;
  const pageCount = usersQuery.data ? usersQuery.data.meta.last_page : 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<UserFormErrors>(null);
  const [editErrors, setEditErrors] = useState<UserFormErrors>(null);

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

  const handleRoleFilterChange = (selectedRoles: Array<string>) => {
    navigate({
      to: "/users",
      search: (prev: any) => ({
        ...prev,
        role: selectedRoles,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleStatusFilterChange = (selectedStatuses: Array<string>) => {
    navigate({
      to: "/users",
      search: (prev: any) => ({
        ...prev,
        status: selectedStatuses,
        page: 1,
      }),
      replace: true,
    });
  };

  const createUserFn = useServerFn(createUser);
  const updateUserFn = useServerFn(updateUser);
  const deleteUserFn = useServerFn(deleteUser);
  const toggleUserStatusFn = useServerFn(toggleUserStatus);

  const handleAdd = async (payload: {
    name: string;
    email: string;
    role: string;
  }): Promise<boolean> => {
    setAddErrors(null);
    try {
      const result = await createUserFn({
        data: { nama: payload.name, email: payload.email, role: payload.role },
      });
      toast.success(result?.message || "User berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as UserFormErrors;
      setAddErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menambahkan user";
      toast.error(msg);
      return false;
    }
  };

  const handleEdit = async ({
    id,
    role,
  }: {
    id: number;
    role: string;
  }): Promise<boolean> => {
    setEditErrors(null);
    try {
      const result = await updateUserFn({ data: { id, role } });
      toast.success(result?.message || "User berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as UserFormErrors;
      setEditErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui user";
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const result = await deleteUserFn({ data: { id } });
      toast.success(result?.message || "User berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus user";
      toast.error(msg);
      return false;
    }
  };

  const handleToggleStatus = async (
    id: number,
    nextActive: boolean,
  ): Promise<boolean> => {
    try {
      const result = await toggleUserStatusFn({ data: { id } });
      toast.success(
        result?.message ||
          (nextActive
            ? "User berhasil diaktifkan"
            : "User berhasil dinon-aktifkan"),
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengubah status user";
      toast.error(msg);
      return false;
    }
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
        roleOptions={ROLE_OPTIONS}
      />

      <SearchBar
        placeholder="Cari pengguna..."
        className="mb-1"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <FilterBar
        roleOptions={ROLE_OPTIONS}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
        defaultSelectedRoles={roleFilter}
        defaultSelectedStatuses={statusFilter}
        isLoading={usersQuery.isLoading}
        className="mb-4"
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
        roleOptions={ROLE_OPTIONS}
      />
    </>
  );
}
