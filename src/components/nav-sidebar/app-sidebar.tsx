"use client";

import * as React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { navItems } from "./nav-data";
import { SearchBar } from "./search-bar";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/services/authService";

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  const { data: user } = useUserProfile();
  const router = useRouter();

  const logoutfn = useServerFn(logout);
  const queryClient = useQueryClient();

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const logoutAndRedirect = async () => {
    try {
      await logoutfn();
      toast.success("Logout berhasil!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Logout gagal. Coba lagi.";
      toast.error(msg);
    }
    localStorage.removeItem("user");
    queryClient.removeQueries({
      queryKey: ["profile"],
    });
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar collapsible="icon" {...props} className="pt-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[slot=sidebar-menu-button]:p-1!"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="size-10 object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base">
                  Keuangan Pemuda
                </span>
                <span className="truncate font-bold text-base">
                  Perumahan Nogotirto V
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SearchBar className="sm:hidden block" />
              </SidebarMenuItem>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="h-12 font-medium hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:hover:bg-slate-800 data-[active=true]:hover:text-white"
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:p-1! hover:bg-slate-100"
            >
              <Link to="/profile">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={user?.profile_image ?? undefined}
                      alt={user?.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-200 text-slate-700 font-bold">
                      {user?.name ? (
                        getInitials(user.name)
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {user?.name || "Memuat..."}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "Memuat..."}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white hover:text-white group-data-[collapsible=icon]:p-2.5! cursor-pointer"
              onClick={async () => {
                await logoutAndRedirect();
              }}
            >
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                Log out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
