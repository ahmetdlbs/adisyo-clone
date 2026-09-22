"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { getServerEnv } from "@/lib/env";
import { safeRedirectPath } from "../model/access";
import { loginSchema, type LoginState } from "../model/login";
import { verifyCredentials } from "./credentials";
import { createSession, deleteSession } from "./session";

// One message for "no such user" and "wrong password": the response must not say which one it was.
const INVALID_CREDENTIALS_MESSAGE = "Kullanıcı adı veya şifre hatalı.";

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

  if (!verifyCredentials(parsed.data, getServerEnv())) {
    return { message: INVALID_CREDENTIALS_MESSAGE, username: typedUsername };
  }

  await createSession(parsed.data.username);

  const next = formData.get("next");
  redirect(safeRedirectPath(typeof next === "string" ? next : undefined));
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect(ROUTES.login);
}
