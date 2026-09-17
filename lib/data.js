export const rupiah = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const todayISO = () => new Date().toISOString().slice(0, 10);

const CAT_COLORS = [
  "#C9A227",
  "#3B6FA0",
  "#3F7D58",
  "#C4432B",
  "#8659A6",
  "#4C7A8C",
];
export function categoryColor(cat = "") {
  let h = 0;
  for (let i = 0; i < cat.length; i++)
    h = (h * 31 + cat.charCodeAt(i)) % CAT_COLORS.length;
  return CAT_COLORS[h];
}

export function seedProducts() {
  return [
    {
      id: uid(),
      name: "Kopi Susu 250ml",
      category: "Minuman",
      price: 15000,
      cost: 8000,
      stock: 24,
      minStock: 5,
      physicalStock: null,
    },
    {
      id: uid(),
      name: "Teh Manis Botol",
      category: "Minuman",
      price: 8000,
      cost: 4000,
      stock: 30,
      minStock: 8,
      physicalStock: null,
    },
    {
      id: uid(),
      name: "Roti Bakar Coklat",
      category: "Makanan",
      price: 12000,
      cost: 6500,
      stock: 4,
      minStock: 5,
      physicalStock: null,
    },
    {
      id: uid(),
      name: "Keripik Singkong",
      category: "Snack",
      price: 10000,
      cost: 6000,
      stock: 18,
      minStock: 6,
      physicalStock: null,
    },
    {
      id: uid(),
      name: "Air Mineral 600ml",
      category: "Minuman",
      price: 5000,
      cost: 3000,
      stock: 2,
      minStock: 10,
      physicalStock: null,
    },
    {
      id: uid(),
      name: "Nasi Goreng Box",
      category: "Makanan",
      price: 18000,
      cost: 11000,
      stock: 9,
      minStock: 4,
      physicalStock: null,
    },
  ];
}

export function seedUsers() {
  return [
    {
      id: "owner1",
      name: "Pemilik Toko",
      position: "Owner",
      username: "owner",
      password: "owner123",
      role: "owner",
    },
    {
      id: "emp1",
      name: "Abiyu",
      position: "Kasir",
      username: "abi",
      password: "abi123",
      role: "karyawan",
    },
    {
      id: "emp2",
      name: "Rafi",
      position: "Gudang",
      username: "rafi",
      password: "rafi123",
      role: "karyawan",
    },
  ];
}

export function seedShifts() {
  return [
    { id: "s1", name: "Shift Pagi", start: "07:00", end: "15:00" },
    { id: "s2", name: "Shift Malam", start: "15:00", end: "23:00" },
  ];
}

export const K = {
  products: "kasirku:products",
  users: "kasirku:users",
  shifts: "kasirku:shifts",
  attendance: "kasirku:attendance",
  transactions: "kasirku:transactions",
  session: "kasirku:session",
  theme: "kasirku:theme",
};
