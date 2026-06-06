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
  },
  {
    title: "Laporan Keuangan",
    url: "/laporan-keuangan",
    icon: FileText,
  },
  {
    title: "Transaksi Keuangan",
    url: "/transaksi-keuangan",
    icon: Banknote,
  },
  {
    title: "Mutasi Rekening",
    url: "/mutasi-rekening",
    icon: ArrowRightLeft,
  },
  {
    title: "History Riil",
    url: "/history-riil",
    icon: History,
  },
  {
    title: "Penanggung Jawab",
    url: "/penanggung-jawab",
    icon: UserCog,
  },
  {
    title: "Akun Keuangan",
    url: "/pengaturan-akun-keuangan",
    icon: Settings,
  },
  {
    title: "User",
    url: "/users",
    icon: Users,
  },
];
