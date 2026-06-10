import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "@/services/authService";
import { getProfile } from "@/services/profileService";

export function useUserProfile() {
  const profilefn = useServerFn(getProfile);
  return useQuery<User | undefined>({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching user profile...");
      const data = await profilefn();
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
      }
      console.log("User profile fetched:", data);
      return data;
    },
    initialData: undefined,
    staleTime: 1000 * 60 * 5,
  });
}
