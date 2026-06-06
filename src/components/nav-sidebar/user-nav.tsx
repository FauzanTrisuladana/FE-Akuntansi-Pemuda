// Login feature disabled for auth checking - DO NOT DELETE
// import * as React from "react"
// Login feature disabled for auth checking - DO NOT DELETE
// import { useState } from "react"
// Login feature disabled for auth checking - DO NOT DELETE
// import { useQueryClient } from "@tanstack/react-query"
// Login feature disabled for auth checking - DO NOT DELETE
// import { Link } from "@tanstack/react-router"
import { useRouter } from "@tanstack/react-router"
import {
  // Login feature disabled for auth checking - DO NOT DELETE
  // Building2,
  // Check,
  ChevronDown,
  LogOut,
  // Login feature disabled for auth checking - DO NOT DELETE
  // LogOut,
  User as UserIcon,
} from "lucide-react"
// Login feature disabled for auth checking - DO NOT DELETE
// import type { Koperasi } from "@/services/authService"
// import { logout } from "@/services/authService"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Login feature disabled for auth checking - DO NOT DELETE
// function getKoperasiList(): Array<Koperasi> {
//   try {
//     if (typeof window === "undefined") return []
//     const stored = localStorage.getItem("koperasiList")
//     return stored ? JSON.parse(stored) : []
//   } catch {
//     return []
//   }
// }

// Login feature disabled for auth checking - DO NOT DELETE
// function getActiveKoperasiId(): number | null {
//   try {
//     if (typeof window === "undefined") return null
//     const stored = localStorage.getItem("koperasiActive")
//     if (!stored) return null
//     const parsed = JSON.parse(stored)
//     const id = parsed?.koperasi?.id
//     return typeof id === "number" ? id : null
//   } catch {
//     return null
//   }
// }

// Login feature disabled for auth checking - DO NOT DELETE
// function getActiveKoperasi(): Koperasi | null {
//   try {
//     if (typeof window === "undefined") return null
//     const stored = localStorage.getItem("koperasiActive")
//     return stored ? (JSON.parse(stored) as Koperasi) : null
//   } catch {
//     return null
//   }
// }

export function UserNav() {
  // Login feature disabled for auth checking - DO NOT DELETE
  // const { data: user } = useUserProfile()
  // const qc = useQueryClient()
  const router = useRouter()

  // Login feature disabled for auth checking - DO NOT DELETE
  // const [koperasiList] = React.useState<Array<Koperasi>>(() => getKoperasiList())
  // const [activeId, setActiveId] = React.useState<number | null>(() => getActiveKoperasiId())

  // Login feature disabled for auth checking - DO NOT DELETE
  // const activeKoperasi = getActiveKoperasi()

  // Login feature disabled for auth checking - DO NOT DELETE
  // const switchKoperasi = async (item: Koperasi) => {
  //   if (item.koperasi.id === activeId) return

  //   localStorage.setItem("koperasiActive", JSON.stringify(item))
  //   localStorage.setItem("anggota", JSON.stringify(item.anggota))
  //   localStorage.setItem("permissions", JSON.stringify(item.permissions))

  //   setActiveId(item.koperasi.id)

  //   // Panggil ulang profile segera (akan memanggil API /profile/me)
  //   // supaya storage (anggota/permissions/koperasiActive) tersinkron sebelum reload.
  //   try {
  //     await qc.refetchQueries({ queryKey: ["profile"], exact: true })
  //   } finally {
  //     // Reload page to apply new permissions everywhere
  //     window.location.reload()
  //   }
  // }

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Login feature disabled for auth checking - DO NOT DELETE
  // Using dummy user data from useUserProfile hook
  const { data: user } = useUserProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-slate-100 h-12 gap-2 px-2">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={user?.photo_profile || undefined}
              alt={user?.nama || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-xs">
              {user?.nama ? getInitials(user.nama) : "..."}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nama || "Pengguna"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "—"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Login feature disabled for auth checking - DO NOT DELETE */}
          {/* <Link to="/profile" className="w-full cursor-pointer"> */}
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.navigate({ to: '/profile' })}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* </Link> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Login feature disabled for auth checking - DO NOT DELETE */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          // onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}