import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileInfoProps {
  user: {
    name: string;
    email: string;
  };
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <Card className="shadow-lg border-3 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="w-4 h-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" defaultValue={user.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="gap-2">
              <i className="bi bi-check-circle" />
              Simpan Perubahan
            </Button>
            <Button type="reset" variant="outline">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
