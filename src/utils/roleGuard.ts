import { useUserProfile } from "@/hooks/use-user-profile";

/**
 * Check if the current user has the required role(s).
 * Use this in client-side components or route beforeLoad.
 */
export function useRoleGuard(allowedRoles: Array<string>) {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return { authorized: false, isLoading: true, role: null };
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return { authorized: false, isLoading: false, role: user?.role ?? null };
  }

  return { authorized: true, isLoading: false, role: user.role };
}
