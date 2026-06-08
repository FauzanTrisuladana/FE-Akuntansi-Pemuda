import { createFileRoute } from "@tanstack/react-router";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfilePassword } from "@/components/profile/profile-password";

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
      <ProfileAvatar user={mockUser} />
      <ProfileInfo user={mockUser} />
      <ProfilePassword hasPassword={mockUser.has_password} />
    </div>
  );
}
