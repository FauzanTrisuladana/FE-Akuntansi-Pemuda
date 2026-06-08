import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileInfo({
  user,
}: {
  user: { name: string; email: string } & Record<string, any> & {
      has_password?: boolean;
    };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="w-4 h-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={user.name}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="pl-9 bg-slate-50 cursor-not-allowed"
              />
            </div>
          </div>

          <Button
            className="bg-slate-900 text-white hover:bg-slate-800 gap-2"
            disabled
          >
            Simpan Perubahan (Mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
