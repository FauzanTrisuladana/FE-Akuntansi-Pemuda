import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'
import { User } from '@/services/authService'
import { useServerFn } from '@tanstack/react-start';

export function useUserProfile() {
  const profilefn = useServerFn(getProfile)
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await profilefn()
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(data))
      }
      return data as unknown as User
    },
    initialData: () => {
      try {
        if (typeof window === 'undefined') return undefined
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : undefined
      } catch {
        return undefined
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}
