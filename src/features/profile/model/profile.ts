import { z } from "zod";
import { isPhoneNumber } from "@/lib/phone";

const MAX_NAME_LENGTH = 40;

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, "İsim zorunludur").max(MAX_NAME_LENGTH, `İsim en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  lastName: z.string().trim().min(1, "Soyisim zorunludur").max(MAX_NAME_LENGTH, `Soyisim en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  phone: z.string().trim().min(1, "Telefon numarası zorunludur").refine(isPhoneNumber, "Geçerli bir telefon numarası giriniz"),
  email: z.string().trim().min(1, "E-posta zorunludur").email("Geçerli bir e-posta giriniz"),
  pin: z
    .string()
    .trim()
    .refine((text) => text === "" || /^\d+$/.test(text), "Pin yalnızca rakam olmalıdır")
    .refine((text) => text === "" || !text.startsWith("0"), "Pin 0 ile başlayamaz"),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
