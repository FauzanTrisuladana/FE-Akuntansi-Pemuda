export type UserStatus = "aktif" | "pending" | "tidak_aktif";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  peran?: string | null;
  profile_image?: string | null;
  role?: { id: number; name: string } | null;
  status: UserStatus;
};

export type RoleOption = {
  id: number;
  name: string;
};

export type UserFormErrors = Partial<Record<string, Array<string>>> | null;

export const MOCK_PHOTOS = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
  "https://i.pravatar.cc/100?img=6",
  "https://i.pravatar.cc/100?img=7",
  "https://i.pravatar.cc/100?img=8",
  "https://i.pravatar.cc/100?img=9",
  "https://i.pravatar.cc/100?img=10",
  "https://i.pravatar.cc/100?img=11",
];

export const MOCK_ROLE_OPTIONS: Array<RoleOption> = [
  { id: 1, name: "Bendahara" },
  { id: 2, name: "Biasa" },
];

export const MOCK_USERS: Array<UserRecord> = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alicesmith@example.com",
    peran: "Bendahara",
    role: { id: 1, name: "Bendahara" },
    status: "aktif",
    profile_image: MOCK_PHOTOS[0],
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bobjohnson@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "pending",
    profile_image: MOCK_PHOTOS[1],
  },
  {
    id: 3,
    name: "Clara Garcia",
    email: "claragarcia@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[2],
  },
  {
    id: 4,
    name: "David Brown",
    email: "davidbrown@example.com",
    peran: "Bendahara",
    role: { id: 1, name: "Bendahara" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[3],
  },
  {
    id: 5,
    name: "Emma Lee",
    email: "emmalex@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[4],
  },
  {
    id: 6,
    name: "Frank Wong",
    email: "frankwong@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[5],
  },
  {
    id: 7,
    name: "Grace Taylor",
    email: "gracetaylor@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[6],
  },
  {
    id: 8,
    name: "Isabella Clark",
    email: "isabellaclark@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[7],
  },
  {
    id: 9,
    name: "Henry Ford",
    email: "henryford@example.com",
    peran: "Biasa",
    role: { id: 2, name: "Biasa" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[8],
  },
  {
    id: 10,
    name: "Ivy Martinez",
    email: "ivymartinez@example.com",
    peran: "Bendahara",
    role: { id: 1, name: "Bendahara" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[9],
  },
  {
    id: 11,
    name: "Jack Wilson",
    email: "jackwilson@example.com",
    peran: "Bendahara",
    role: { id: 1, name: "Bendahara" },
    status: "tidak_aktif",
    profile_image: MOCK_PHOTOS[10],
  },
];
