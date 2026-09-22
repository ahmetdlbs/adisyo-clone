export const WORK_TYPES = ["Masa Siparişi", "Paket Sipariş", "Gel Al Sipariş"] as const;
export const PAYMENT_TYPES = ["Nakit", "Kredi Kartı", "Multinet", "Smart Ticket", "SetCard", "Pluxee (Sodexo)", "Diğer"] as const;

export interface OnboardingOption {
  title: string;
  desc: string;
}

export const KITCHEN_DELIVERY_OPTIONS: readonly OnboardingOption[] = [
  { title: "Yazıcı ile", desc: "Mutfak fişi basılıyor" },
  { title: "Mutfak Ekranı", desc: "Mutfak ekranında görülüyor" },
  { title: "Her İkisi", desc: "Hem yazıcı hem mutfak ekranı" },
];

export const PAYMENT_TIME_OPTIONS: readonly OnboardingOption[] = [
  { title: "Sipariş Alınırken", desc: "Peşin / Hemen" },
  { title: "Teslimde", desc: "Müşteri, ürünü teslim alırken" },
  { title: "Karışık", desc: "Bazı müşterilerden önden, bazılarından sonra" },
];

export const RECEIPT_OPTIONS: readonly OnboardingOption[] = [
  { title: "Evet", desc: "Her zaman" },
  { title: "Hayır", desc: "Gerekmiyor" },
  { title: "Opsiyonel", desc: "Sadece müşteri isterse" },
];

export const BUSINESS_TYPES = ["Cafe", "Restaurant", "Fast Food", "Bar", "Otel İçi Cafe-Restaurant", "Diğer"] as const;

export const ONBOARDING_STEPS = [
  { id: 1, title: "Çalışma Ayarlarınız" },
  { id: 2, title: "İşletme Bilgileriniz" },
  { id: 3, title: "Harika! Her Şey Hazır" },
] as const;

export interface OnboardingAnswers {
  workTypes: readonly string[];
  paymentTypes: readonly string[];
  kitchenDelivery: string;
  paymentTime: string;
  receiptGiven: string;
  businessType: string;
  country: string;
  city: string;
  dayStart: string;
  dayEnd: string;
}

/** Defaults a new restaurant most likely wants, so the wizard is usable without changing anything. */
export const createInitialOnboardingAnswers = (): OnboardingAnswers => ({
  workTypes: ["Masa Siparişi"],
  paymentTypes: ["Nakit", "Kredi Kartı"],
  kitchenDelivery: "Her İkisi",
  paymentTime: "Karışık",
  receiptGiven: "Opsiyonel",
  businessType: "Cafe",
  country: "Türkiye",
  city: "",
  dayStart: "06:00",
  dayEnd: "23:45",
});

/** Adds `value` to the list, or removes it if already there. Returns a new array. */
export function toggleInList(list: readonly string[], value: string): readonly string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}
