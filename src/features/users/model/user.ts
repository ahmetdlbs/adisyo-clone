import { z } from "zod";
import { isPhoneNumber } from "@/lib/phone";

export const USER_ROLES = ["Yönetici", "Kasiyer", "Garson"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  /** Running number shown in the list. Never reused, even after a delete. */
  no: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  region: string;
  /** Recognised as caller ID on incoming phone orders. */
  callerId: boolean;
  /** Cannot sign in while true. */
  blockLogin: boolean;
  /** Switches accounts with a PIN instead of e-mail and password. */
  usePin: boolean;
  /** No sign-in has happened yet in this demo, so this is always null. */
  lastLogin: string | null;
}

const MAX_NAME_LENGTH = 60;
const MIN_PASSWORD_LENGTH = 4;

export const userFormSchema = z.object({
  role: z.enum(USER_ROLES),
  name: z.string().trim().min(1, "Ad Soyad zorunludur").max(MAX_NAME_LENGTH, `Ad Soyad en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  email: z.string().trim().refine((text) => text === "" || z.string().email().safeParse(text).success, "Geçerli bir e-posta giriniz"),
  phone: z.string().trim().min(1, "Telefon numarası zorunludur").refine(isPhoneNumber, "Geçerli bir telefon numarası giriniz"),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır`),
  region: z.string().trim(),
  callerId: z.boolean(),
  blockLogin: z.boolean(),
  usePin: z.boolean(),
});
export type UserFormValues = z.infer<typeof userFormSchema>;

/** What a search box looks through. */
export const userSearchText = (user: User): string => `${user.name} ${user.email} ${user.phone} ${user.role}`;
