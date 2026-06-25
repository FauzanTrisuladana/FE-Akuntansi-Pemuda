import {
  ArrowRightLeft,
  Banknote,
  FileText,
  History,
  House,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: House,
    roles: ["bendahara", "biasa"],
  },
  {
    title: "Laporan Keuangan",
    url: "/laporan-keuangan",
    icon: FileText,
    roles: ["bendahara", "biasa"],
  },
  {
    title: "Transaksi Keuangan",
    url: "/transaksi-keuangan",
    icon: Banknote,
    roles: ["bendahara"],
  },
  {
    title: "Mutasi Akun",
    url: "/mutasi-rekening",
    icon: ArrowRightLeft,
    roles: ["bendahara"],
  },
  {
    title: "History Riil",
    url: "/history-riil",
    icon: History,
    roles: ["bendahara"],
  },
  {
    title: "Penanggung Jawab",
    url: "/penanggung-jawab",
    icon: UserCog,
    roles: ["bendahara"],
  },
  {
    title: "Akun Keuangan",
    url: "/pengaturan-akun-keuangan",
    icon: Settings,
    roles: ["bendahara"],
  },
  {
    title: "User",
    url: "/users",
    icon: Users,
    roles: ["bendahara"],
  },
];
