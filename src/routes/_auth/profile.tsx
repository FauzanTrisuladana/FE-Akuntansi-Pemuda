import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { ProfileInfo } from '@/components/profile/profile-info'
import { ProfilePassword } from '@/components/profile/profile-password'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (error || !user) {
    return (
      <ErrorPage 
        title="Gagal Memuat Profil" 
        error={error} 
        reset={refetch} 
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />
      <ProfileAvatar user={user} />
      <ProfileInfo user={user} />
      <ProfilePassword hasPassword={user.has_password} />
    </div>
  )
}