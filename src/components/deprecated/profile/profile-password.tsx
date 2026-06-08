import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePasswordProps {
  hasPassword: boolean;
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Lock className="w-4 h-4 text-slate-800" />
          {hasPassword ? "Ganti Kata Sandi" : "Buat Kata Sandi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            {hasPassword
              ? "Halaman ini menampilkan data mock. Fitur ganti kata sandi dinonaktifkan."
              : "Halaman ini menampilkan data mock. Fitur buat kata sandi dinonaktifkan."}
          </p>
          <Button className="w-full md:w-auto h-11 font-semibold" disabled>
            {hasPassword ? "Perbarui Kata Sandi" : "Simpan Kata Sandi"} (Mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
