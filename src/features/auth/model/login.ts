import { z } from "zod";

const USERNAME_REQUIRED = "Boş geçilemez";
const PASSWORD_REQUIRED = "Lütfen şifrenizi giriniz";

/** Shared by the form (client feedback) and the Server Action (the check that actually counts). */
export const loginSchema = z.object({
  // `get()` on a missing FormData field yields null, hence the type-error message too.
  username: z.string({ invalid_type_error: USERNAME_REQUIRED, required_error: USERNAME_REQUIRED }).trim().min(1, USERNAME_REQUIRED),
  // Passwords are compared as typed: never trimmed.
  password: z.string({ invalid_type_error: PASSWORD_REQUIRED, required_error: PASSWORD_REQUIRED }).min(1, PASSWORD_REQUIRED),
});

export type LoginValues = z.infer<typeof loginSchema>;

/** What the login Server Action returns to `useActionState`. Never contains the password. */
export interface LoginState {
  fieldErrors?: { username?: string; password?: string };
  /** A form-level error, e.g. wrong credentials. */
  message?: string;
  /** What was typed, so the field can be refilled after a failed attempt. */
  username?: string;
}

export const INITIAL_LOGIN_STATE: LoginState = {};
