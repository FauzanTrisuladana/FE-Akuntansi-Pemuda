import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileAvatarProps {
  user: {
    profile_image?: string | null;
    name: string;
    username: string;
  };
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const isExternalImage = user.profile_image?.startsWith("http://") || user.profile_image?.startsWith("https://");

  return (
    <Card className="shadow-lg border-3 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          Foto Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        {user.profile_image ? (
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage
              src={isExternalImage ? user.profile_image : `/storage/${user.profile_image}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="bg-destructive text-white rounded-full flex items-center justify-center mb-3" style={{ width: "100px", height: "100px", fontSize: "48px" }}>
            {getInitials(user.name)}
          </div>
        )}

        <Button variant="outline" className="gap-2" disabled>
          <Camera className="w-4 h-4" />
          Ubah Foto
        </Button>
      </CardContent>
    </Card>
  );
}
