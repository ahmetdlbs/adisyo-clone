"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { safeRedirectPath } from "../model/access";
import { ApiError } from "@/lib/api-client";
import { loginSchema, type LoginState } from "../model/login";
import { registerSchema, type RegisterFormInput, type RegisterState } from "../model/register";
import { registerRestaurant, verifyCredentials } from "./credentials";
import { createSession, deleteSession } from "./session";

// One message for "no such user" and "wrong password": the response must not say which one it was.
const INVALID_CREDENTIALS_MESSAGE = "Kullanıcı adı veya şifre hatalı.";
const CONNECTION_ERROR_MESSAGE = "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.";

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const typedUsername = String(formData.get("username") ?? "");

  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { fieldErrors: { username: errors.username?.[0], password: errors.password?.[0] }, username: typedUsername };
  }

  // An outage (api/ unreachable, 5xx, ...) is not "wrong credentials" — verifyCredentials rethrows it as
  // such, so it must be caught here too, or it would crash the whole page instead of the login form.
  let result;
  try {
    result = await verifyCredentials(parsed.data);
  } catch {
    return { message: CONNECTION_ERROR_MESSAGE, username: typedUsername };
  }
  if (!result) {
    return { message: INVALID_CREDENTIALS_MESSAGE, username: typedUsername };
  }

  await createSession(result.token);

  const next = formData.get("next");
  redirect(safeRedirectPath(typeof next === "string" ? next : undefined));
}

const EMAIL_TAKEN_MESSAGE = "Bu e-posta ile kayıtlı bir hesap var. Giriş yapmayı deneyin.";
const TOO_MANY_ATTEMPTS_MESSAGE = "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.";
const REGISTER_FAILED_MESSAGE = "Kayıt tamamlanamadı. Lütfen daha sonra tekrar deneyin.";

/** Creates the restaurant and signs its owner in. The form's rules are re-checked here: the client is not trusted. */
export async function registerAction(input: RegisterFormInput): Promise<RegisterState> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? REGISTER_FAILED_MESSAGE };

  let result;
  try {
    result = await registerRestaurant(parsed.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) return { ok: false, message: EMAIL_TAKEN_MESSAGE, field: "email" };
    if (error instanceof ApiError && error.status === 429) return { ok: false, message: TOO_MANY_ATTEMPTS_MESSAGE };
    return { ok: false, message: REGISTER_FAILED_MESSAGE };
  }

  await createSession(result.token);
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect(ROUTES.login);
}
