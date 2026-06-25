import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfilePassword } from "@/components/profile/profile-password";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, isLoading, isError } = useUserProfile();
  const queryClient = useQueryClient();
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profile_image) {
      setCurrentPhoto(user.profile_image);
    }
  }, [user?.profile_image]);

  const handlePhotoUpdated = (newImageUrl: string) => {
    setCurrentPhoto(newImageUrl);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const userWithPhoto = user ? { ...user, profile_image: currentPhoto } : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="h-48 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-48 rounded-lg bg-slate-100 animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-32 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <p className="text-center text-muted-foreground">Gagal memuat profil</p>
      </div>
    );
  }

  if (!userWithPhoto) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Profile Info & Password */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <ProfileInfo user={userWithPhoto} />
          <ProfilePassword hasPassword={userWithPhoto.has_password} />
        </div>

        {/* Sidebar - Profile Avatar at top, Danger Zone at bottom */}
        <div className="flex flex-col gap-4">
          <ProfileAvatar
            user={userWithPhoto}
            onPhotoUpdated={handlePhotoUpdated}
          />
          <ProfileDangerZone />
        </div>
      </div>
    </div>
  );
}
