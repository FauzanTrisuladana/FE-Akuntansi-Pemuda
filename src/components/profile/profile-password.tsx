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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          {hasPassword ? (
            <Lock className="w-4 h-4 text-slate-800" />
          ) : (
            <KeyRound className="w-4 h-4 text-slate-800" />
          )}
          {hasPassword ? "Ganti Kata Sandi" : "Buat Kata Sandi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Masukkan kata sandi lama"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-password">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                id="new-password"
                type="password"
                placeholder="Minimal 6 karakter"
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type="password"
                placeholder="Ulangi kata sandi baru"
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full md:w-auto h-11 font-semibold"
              disabled
            >
              {hasPassword ? "Perbarui Kata Sandi (Mock)" : "Simpan Kata Sandi (Mock)"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
