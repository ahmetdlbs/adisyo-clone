import { z } from "zod";

const COUNTRY_CODES = ["+90", "+1"] as const;
export const COUNTRY_CODE_OPTIONS = COUNTRY_CODES.map((code) => ({ value: code, label: code }));

const EMAIL_REQUIRED = "E-posta zorunludur";
const EMAIL_INVALID = "Geçerli bir e-posta adresi giriniz";
const isEmail = (value: string) => z.string().email().safeParse(value).success;

// One issue per field: "required" for empty input, "invalid" otherwise, never both at once.
const emailField = z.string().trim().superRefine((value, context) => {
  if (value === "") context.addIssue({ code: "custom", message: EMAIL_REQUIRED });
  else if (!isEmail(value)) context.addIssue({ code: "custom", message: EMAIL_INVALID });
});

export const forgotPasswordSchema = z.object({ email: emailField });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const MIN_PASSWORD_LENGTH = 8;

export const registerSchema = z
  .object({
    restaurantName: z.string().trim().min(2, "Restoran adı en az 2 karakter olmalıdır").max(80, "Restoran adı en fazla 80 karakter olabilir"),
    fullName: z
      .string()
      .trim()
      .min(2, "Ad soyad zorunludur")
      .refine((name) => name.split(/\s+/).length >= 2, "Lütfen ad ve soyadınızı giriniz"),
    email: emailField,
    countryCode: z.enum(COUNTRY_CODES),
    // Users type spaces, brackets and dashes; only the digits are kept.
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\d{7,15}$/, "Geçerli bir telefon numarası giriniz")),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır`)
      .regex(/\p{L}/u, "Şifre en az bir harf içermelidir")
      .regex(/\d/, "Şifre en az bir rakam içermelidir"),
    passwordConfirm: z.string().min(1, "Şifre tekrarı zorunludur"),
    // z.boolean + refine (not z.literal(true)) so the unticked default `false` is a valid form input.
    acceptedTerms: z.boolean().refine((accepted) => accepted, "Devam etmek için sözleşmeyi kabul etmelisiniz"),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Şifreler eşleşmiyor",
  });

export type RegisterState = { ok: true } | { ok: false; message: string; field?: "email" };

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormValues = z.output<typeof registerSchema>;
