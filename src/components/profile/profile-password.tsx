import { KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/services/profileService";
import { useQueryClient } from "@tanstack/react-query";

interface ProfilePasswordProps {
  hasPassword: boolean;
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const updatePasswordFn = useServerFn(updatePassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi kata sandi tidak cocok");
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePasswordFn({
        data: {
          current_password: hasPassword ? currentPassword : undefined,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      queryClient.invalidateQueries();
      toast.success("Kata sandi berhasil diperbarui!");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui kata sandi";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-3 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          {hasPassword ? (
            <Lock className="w-4 h-4" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          {hasPassword ? "Ubah Kata Sandi" : "Atur Kata Sandi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Masukkan kata sandi lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Kata Sandi Baru</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword_confirmation">
              Konfirmasi Kata Sandi Baru
            </Label>
            <Input
              id="newPassword_confirmation"
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <i className="bi bi-shield-lock" />
              {isSubmitting ? "Memperbarui..." : "Perbarui Kata Sandi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
