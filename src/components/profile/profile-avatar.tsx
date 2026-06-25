import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import type { SerializedFile } from "@/services/transaksiService";
import type { User } from "@/services/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfilePhoto } from "@/services/profileService";

interface ProfileAvatarProps {
  user: User;
  onPhotoUpdated?: (newImageUrl: string) => void;
}

// Helper to convert File to a serializable format for server function boundary
const fileToSerializedFile = (file: File): Promise<SerializedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      const base64 = result.split(",")[1];
      resolve({ base64, name: file.name, type: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function ProfileAvatar({ user, onPhotoUpdated }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfilePhotoFn = useServerFn(updateProfilePhoto);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Pilih file gambar yang valid");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const serializedFile = await fileToSerializedFile(file);
      const result = await updateProfilePhotoFn({
        data: { profile_image: serializedFile },
      });
      if (result) {
        toast.success("Foto profil berhasil diupdate");
        setPreviewUrl(null);
        onPhotoUpdated?.(result.profile_image ?? "");
      } else {
        toast.error("Gagal mengupdate foto profil");
      }
    } catch {
      toast.error("Gagal mengupdate foto profil");
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || user.profile_image || undefined;

  return (
    <Card className="shadow-lg border-3 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          Foto Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        {isUploading ? (
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-slate-100">
              {displayImage ? (
                <AvatarImage src={displayImage} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          </div>
        ) : displayImage ? (
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage src={displayImage} className="object-cover" />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className="bg-destructive text-white rounded-full flex items-center justify-center mb-3"
            style={{ width: "100px", height: "100px", fontSize: "48px" }}
          >
            {getInitials(user.name)}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isUploading ? "Mengupload..." : "Ubah Foto"}
        </Button>
      </CardContent>
    </Card>
  );
}
