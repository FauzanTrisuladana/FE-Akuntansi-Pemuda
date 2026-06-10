import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import type { RoleOption, UserFormErrors, UserRecord } from "./types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRecord | null;
  onSave: (payload: { id: number; role: string }) => Promise<boolean> | boolean;
  roleOptions: Array<RoleOption>;
  errors?: UserFormErrors;
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
  roleOptions,
  errors,
}: UserEditDialogProps) {
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const success = await onSave({
        id: user.id,
        role,
      });
      if (success) onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = role.trim() !== "";

  const generalError = errors?.general?.[0];
  const roleError = errors?.role_id?.[0] ?? errors?.role?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <DialogDescription>Silakan ubah data user</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Anggota (readonly) */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Anggota</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">
                  {user?.name ?? "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Role*</Label>
              <div className="flex gap-3">
                {roleOptions.map((r) => {
                  const isSelected = role === r.name;
                  const isBiasa = r.name === "biasa";
                  return (
                    <Badge
                      key={r.id}
                      variant="outline"
                      className={`cursor-pointer rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                        isSelected
                          ? isBiasa
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                      onClick={() => setRole(r.name)}
                    >
                      {r.name === "bendahara" ? "Bendahara" : "Biasa"}
                    </Badge>
                  );
                })}
              </div>
              {roleError ? (
                <p className="text-sm text-destructive">{roleError}</p>
              ) : null}
            </div>

            {generalError ? (
              <p className="text-sm text-destructive">{generalError}</p>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
