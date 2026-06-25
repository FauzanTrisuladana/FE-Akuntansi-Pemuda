import { createServerFn } from "@tanstack/react-start";
import { getProfile } from "@/services/profileService";

/**
 * Check if the current user has the required role(s).
 * Redirects to dashboard if unauthorized.
 */
export const checkRole = createServerFn({ method: "GET" })
  .validator((data: { allowedRoles: Array<string> }) => data)
  .handler(async ({ data }) => {
    try {
      const user = await getProfile();
      if (!user || !data.allowedRoles.includes(user.role)) {
        return {
          authorized: false,
          redirect: "/dashboard",
        };
      }
      return { authorized: true, role: user.role };
    } catch {
      return {
        authorized: false,
        redirect: "/dashboard",
      };
    }
  });
