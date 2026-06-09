import { GoogleIcon } from "@/components/shared/google-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileGoogleConnectProps {
  isConnected: boolean;
}

export function ProfileGoogleConnect({
  isConnected,
}: ProfileGoogleConnectProps) {
  if (isConnected) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <GoogleIcon className="h-4 w-4" />
          Hubungkan Google
        </h6>
        <p className="text-sm text-muted-foreground mb-3">
          Hubungkan akun Anda dengan Google untuk login yang lebih mudah.
        </p>
        <Button variant="outline" className="w-full gap-2" disabled>
          <GoogleIcon className="h-4 w-4" />
          Hubungkan dengan Google (Mock)
        </Button>
        <p className="text-muted-foreground text-xs mt-2">
          *pastikan alamat email yang digunakan sama
        </p>
      </CardContent>
    </Card>
  );
}
