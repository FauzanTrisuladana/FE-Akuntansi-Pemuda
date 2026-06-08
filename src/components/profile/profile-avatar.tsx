import { AlertCircle, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileAvatarProps {
  user: {
    profile_image?: string | null;
    name: string;
    username: string;
  };
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage
              src={user.profile_image || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        <Button variant="outline" className="gap-2" disabled>
          <Camera className="w-4 h-4" />
          Ubah Foto (Mock)
        </Button>
      </CardContent>
    </Card>
  );
}
