import { KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfilePasswordProps {
  hasPassword: boolean;
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
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
        <form className="space-y-5">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Masukkan kata sandi lama"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Kata Sandi Baru</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword_confirmation">Konfirmasi Kata Sandi Baru</Label>
            <Input
              id="newPassword_confirmation"
              type="password"
              placeholder="Ulangi kata sandi baru"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="gap-2">
              <i className="bi bi-shield-lock" />
              Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
