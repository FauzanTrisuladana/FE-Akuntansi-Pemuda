export type UserStatus = "Aktif" | "Tidak Aktif" | "Pending";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  profile_image: string | null;
  has_password: boolean;
};

export type RoleOption = {
  id: number;
  name: string;
};

export type UserFormErrors = Partial<Record<string, Array<string>>> | null;

// Role options for dropdown - sesuai dengan backend enum: biasa, bendahara
export const ROLE_OPTIONS: Array<RoleOption> = [
  { id: 1, name: "bendahara" },
  { id: 2, name: "biasa" },
];

// Status options untuk filter - sesuai dengan backend enum
export const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Aktif", label: "Aktif" },
  { value: "Tidak Aktif", label: "Tidak Aktif" },
  { value: "Pending", label: "Pending" },
];
