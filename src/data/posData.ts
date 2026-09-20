export interface OrderItem {
  id: string;
  name: string;
  portion: string;
  waiter: string;
  price: number;
  quantity: number;
  note?: string;
  isComplimentary?: boolean; // İkram
}

export interface TableData {
  id: string;
  name: string;
  section: "salon" | "bolge2";
  status: "occupied" | "empty";
  customerName?: string;
  waiter?: string;
  orderNumber?: number;
  duration?: string;
  items: OrderItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: "favori" | "icecekler" | "milkshake" | "tatli" | "yiyecekler";
  price: number;
  barcode?: string;
}

export interface KanbanOrder {
  id: string;
  orderNo: string;
  title: string;
  type: "table" | "takeaway" | "delivery" | "integration";
  customerName?: string;
  totalAmount: number;
  status: "integration" | "preparing" | "waiting" | "delivery";
  time: string;
  itemsCount: number;
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  // Favori Ürünler (Only Çay is favorited on softdeap@gmail.com account)
  { id: "p-cay", name: "Çay", category: "favori", price: 52 },

  // İçecekler (Live POS products from product definition screen)
  { id: "p-cay-icecek", name: "Çay", category: "icecekler", price: 52 },
  { id: "p-salep", name: "Salep", category: "icecekler", price: 140 },
  { id: "p-bitki-cayi", name: "Bitki Çayı", category: "icecekler", price: 122 },
  { id: "p-turk-kahvesi", name: "Türk Kahvesi", category: "icecekler", price: 105 },
  { id: "p-filtre-kahve", name: "Filtre Kahve", category: "icecekler", price: 105 },
  { id: "p-su", name: "Su", category: "icecekler", price: 45 },
  { id: "p-ayran", name: "Ayran", category: "icecekler", price: 70 },
  { id: "p-kola", name: "Coca Cola", category: "icecekler", price: 105 },
  { id: "p-soda", name: "Soda", category: "icecekler", price: 52 },
  { id: "p-icetea", name: "Ice Tea", category: "icecekler", price: 87 },
  { id: "p-mocha-frappe", name: "Mocha Frappe", category: "icecekler", price: 175 },
  { id: "p-dondurmali-frappe", name: "Dondurmalı Frappe", category: "icecekler", price: 192 },

  // Milkshake
  { id: "p-ms-cilek", name: "Çilekli Milkshake", category: "milkshake", price: 160 },
  { id: "p-ms-cikolata", name: "Çikolatalı Milkshake", category: "milkshake", price: 160 },
  { id: "p-ms-vanilya", name: "Vanilyalı Milkshake", category: "milkshake", price: 150 },
  { id: "p-ms-muz", name: "Muzlu Milkshake", category: "milkshake", price: 160 },
  { id: "p-ms-karamel", name: "Karamelli Milkshake", category: "milkshake", price: 165 },

  // Tatlı ve Pastalar
  { id: "p-san-seb", name: "San Sebastian Cheesecake", category: "tatli", price: 195 },
  { id: "p-sufle", name: "Sıcak Çikolatalı Sufle", category: "tatli", price: 175 },
  { id: "p-tiramisu", name: "İtalyan Tiramisu", category: "tatli", price: 165 },
  { id: "p-profiterol", name: "Profiterol", category: "tatli", price: 155 },
  { id: "p-waffle", name: "Meyveli Waffle", category: "tatli", price: 210 },

  // Yiyecekler
  { id: "p-karisik-pizza", name: "Karışık Pizza (Orta)", category: "yiyecekler", price: 290 },
  { id: "p-margarita", name: "Margherita Pizza", category: "yiyecekler", price: 245 },
  { id: "p-burger", name: "Adisyo Cheeseburger Menü", category: "yiyecekler", price: 265 },
  { id: "p-tavuk-salata", name: "Izgara Tavuklu Salata", category: "yiyecekler", price: 210 },
  { id: "p-tost", name: "Kaşarlı Karışık Tost", category: "yiyecekler", price: 135 },
  { id: "p-makarna", name: "Penne Arabbiata", category: "yiyecekler", price: 225 },
];

export const INITIAL_TABLES: TableData[] = [
  {
    id: "t-1",
    name: "Masa 1",
    section: "salon",
    status: "occupied",
    customerName: "Ahmet Can",
    waiter: "ahmet",
    orderNumber: 461510410,
    duration: "4 s 20 dk",
    items: [
      { id: "item-1", name: "Çay", portion: "tam", waiter: "ahmet", price: 52, quantity: 1, note: "20:03" },
      { id: "item-2", name: "Coca Cola", portion: "tam", waiter: "ahmet", price: 105, quantity: 1, note: "16:36" },
      { id: "item-3", name: "Salep", portion: "tam", waiter: "ahmet", price: 140, quantity: 1 },
      { id: "item-4", name: "Ayran", portion: "tam", waiter: "ahmet", price: 70, quantity: 1 },
      { id: "item-5", name: "Çay", portion: "tam", waiter: "ahmet", price: 52, quantity: 1 },
    ],
  },
  { id: "t-2", name: "Masa 2", section: "salon", status: "empty", items: [] },
  { id: "t-3", name: "Masa 3", section: "salon", status: "empty", items: [] },
  { id: "t-4", name: "Masa 4", section: "salon", status: "empty", items: [] },
  { id: "t-5", name: "Masa 5", section: "salon", status: "empty", items: [] },
  { id: "t-6", name: "Masa 6", section: "salon", status: "empty", items: [] },
  { id: "t-7", name: "Masa 7", section: "salon", status: "empty", items: [] },
  { id: "t-8", name: "Masa 8", section: "salon", status: "empty", items: [] },
  { id: "t-9", name: "Masa 9", section: "salon", status: "empty", items: [] },
  { id: "t-10", name: "Masa 10", section: "salon", status: "empty", items: [] },

  // Bölge 2 Masaları
  { id: "t-b2-1", name: "Bahçe 1", section: "bolge2", status: "empty", items: [] },
  { id: "t-b2-2", name: "Bahçe 2", section: "bolge2", status: "empty", items: [] },
  { id: "t-b2-3", name: "Bahçe 3", section: "bolge2", status: "empty", items: [] },
  { id: "t-b2-4", name: "Bahçe 4", section: "bolge2", status: "empty", items: [] },
  { id: "t-b2-5", name: "Bahçe 5", section: "bolge2", status: "empty", items: [] },
];

export const INITIAL_KANBAN_ORDERS: KanbanOrder[] = [
  {
    id: "kb-1",
    orderNo: "#102",
    title: "Masa 1",
    type: "table",
    customerName: "Ahmet Can",
    totalAmount: 419,
    status: "preparing",
    time: "20:03",
    itemsCount: 5,
  },
  {
    id: "kb-2",
    orderNo: "#103",
    title: "Gel Al Sipariş",
    type: "takeaway",
    customerName: "Ahmet",
    totalAmount: 47,
    status: "preparing",
    time: "20:05",
    itemsCount: 1,
  },
];
