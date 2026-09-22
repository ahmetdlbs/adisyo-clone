export const RIGHTS_ROLES = ["Garson", "Mutfak", "Kurye", "Kasa", "Müdür", "Çağrı Merkezi"] as const;
export type RightsRole = (typeof RIGHTS_ROLES)[number];

export interface Permission {
  id: string;
  title: string;
  description: string;
}

export const PERMISSIONS: readonly Permission[] = [
  {
    id: "table_area",
    title: "Masa ve Bölge İşlemleri.",
    description: "Kullanıcının salon düzenini yönetmesini; bölge ve masa eklemesini, düzenlemesini ve silmesini sağlar.",
  },
  {
    id: "general_defs",
    title: "Restoran ile ilgili genel tanımlamalar.",
    description: "Kullanıcının işletmenin temel tanımlarını yönetmesini sağlar: KDV oranları, indirimler, müşteriler, kuver/garsoniye, yazıcılar ve cihazlar.",
  },
  {
    id: "general_users",
    title: "Genel kullanıcı işlemleri.",
    description: "Kullanıcının yeni kullanıcı eklemesini, mevcut kullanıcıları düzenlemesini, silmesini ve şifrelerini yenilemesini sağlar.",
  },
  {
    id: "auth_ops",
    title: "Yetkilendirme işlemleri",
    description: "Kullanıcının rollere yetki tanımlamasını veya mevcut yetkileri kaldırmasını sağlar.",
  },
  {
    id: "stock_entry",
    title: "Stok girişi, stok sayımı işlemleri.",
    description: "Kullanıcının stok girişi yapmasını, sayım kaydetmesini ve açılış maliyeti girmesini sağlar.",
  },
  {
    id: "package_integration",
    title: "Paket Sipariş Entegrasyon durumunu değiştirebilir",
    description: "Kullanıcının Yemeksepeti ve Trendyol gibi satış kanallarını sipariş almaya açmasını veya kapatmasını sağlar.",
  },
  {
    id: "b2b_order",
    title: "B2B Sipariş Verebilir",
    description: "Kullanıcının merkeze B2B siparişi oluşturmasını, siparişi onaya göndermesini, B2B ödeme geçmişini ve sipariş itirazlarını görüntülemesini sağlar.",
  },
  {
    id: "view_stock",
    title: "Stok Miktarlarını görüntüleyebilir.",
    description: "Kullanıcının ürünlerin kalan stok miktarını görüntülemesini sağlar.",
  },
  {
    id: "central_integration",
    title: "Merkezi entegrasyon durumlarını yönetebilir",
    description: "Kullanıcının merkezi entegrasyon ayarlarını yapılandırmasını sağlar.",
  },
] as const;

/** Which roles a permission is granted to: `{ [permissionId]: { [role]: granted } }`. A missing entry means not granted. */
export type PermissionGrants = Partial<Record<string, Partial<Record<RightsRole, boolean>>>>;

/** Flips one permission/role cell. Returns a new object. */
export function togglePermission(grants: PermissionGrants, permissionId: string, role: RightsRole): PermissionGrants {
  const forPermission = grants[permissionId] ?? {};
  return { ...grants, [permissionId]: { ...forPermission, [role]: !forPermission[role] } };
}
