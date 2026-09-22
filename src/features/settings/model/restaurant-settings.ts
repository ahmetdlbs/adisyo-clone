import { z } from "zod";

const MAX_NAME_LENGTH = 80;
const MAX_LOCK_SECONDS = 3600;
const MAX_ORDER_NUMBER = 9999;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const wholeNumberField = (message: string, max: number) =>
  z
    .string()
    .trim()
    .transform(Number)
    .pipe(z.number({ invalid_type_error: message }).int(message).min(0, message).max(max, message));

export const restaurantSettingsFormSchema = z.object({
  name: z.string().trim().min(1, "Restaurant adı zorunludur").max(MAX_NAME_LENGTH, `Restaurant adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  dayStart: z.string().regex(TIME_PATTERN, "Saat SS:DD biçiminde olmalıdır"),
  dayEnd: z.string().regex(TIME_PATTERN, "Saat SS:DD biçiminde olmalıdır"),
  lockSeconds: wholeNumberField(`Ekran kilit süresi 0 ile ${MAX_LOCK_SECONDS} arasında olmalıdır`, MAX_LOCK_SECONDS),
  firstOrderNumber: wholeNumberField(`İlk sipariş numarası 0 ile ${MAX_ORDER_NUMBER} arasında olmalıdır`, MAX_ORDER_NUMBER),
  // Presentational only: neither has anywhere in the app it takes effect yet.
  notificationSound: z.string().default("1"),
  workMode: z.string().default("all"),
});
export type RestaurantSettingsFormInput = z.input<typeof restaurantSettingsFormSchema>;
export type RestaurantSettingsFormValues = z.output<typeof restaurantSettingsFormSchema>;
