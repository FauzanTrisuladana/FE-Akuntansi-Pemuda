import { createFileRoute } from "@tanstack/react-router";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfilePassword } from "@/components/profile/profile-password";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";

// Data mock untuk profile
const mockUser = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  profile_image: null,
  has_password: true,
};

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Profile Info & Password */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <ProfileInfo user={mockUser} />
          <ProfilePassword hasPassword={mockUser.has_password} />
        </div>

        {/* Sidebar - Profile Avatar at top, Danger Zone at bottom */}
        <div className="flex flex-col gap-4">
          <ProfileAvatar user={mockUser} />
          <ProfileDangerZone />
        </div>
      </div>
    </div>
  );
}
