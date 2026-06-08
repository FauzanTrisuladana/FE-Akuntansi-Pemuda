import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileDangerZone() {
  return (
    <Card className="shadow-lg border-3 border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Zona Berbahaya
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Hapus akun Anda secara permanen beserta semua data Anda.
        </p>
        <Button variant="outline" className="w-full" disabled>
          Hapus Akun (Mock)
        </Button>
      </CardContent>
    </Card>
  );
}