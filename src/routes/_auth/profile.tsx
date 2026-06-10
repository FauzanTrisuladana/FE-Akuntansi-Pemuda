import { createFileRoute } from "@tanstack/react-router";
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <p className="text-center text-muted-foreground">Memuat profil...</p>
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

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Profile Info & Password */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <ProfileInfo user={user} />
          <ProfilePassword hasPassword={user.has_password} />
        </div>

        {/* Sidebar - Profile Avatar at top, Danger Zone at bottom */}
        <div className="flex flex-col gap-4">
          <ProfileAvatar user={user} />
          <ProfileDangerZone />
        </div>
      </div>
    </div>
  );
}
