"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/kit/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/config/routes";
import { INITIAL_LOGIN_STATE } from "../model/login";
import { loginAction } from "../server/actions";

interface LoginFormProps {
  /** Already validated post-login destination (see safeRedirectPath). */
  next: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_LOGIN_STATE);
  const usernameError = state.fieldErrors?.username;
  const passwordError = state.fieldErrors?.password;

  return (
    <div>
      <h1 className="text-[21px] leading-[30px]">Adisyo&apos;ya hoş geldiniz</h1>
      <p className="mt-2.5 mb-6 text-muted-foreground">Lütfen üyelik bilgileriniz ile giriş yapınız</p>

      {/* The action is a Server Action, so the form also submits without JavaScript. */}
      <form action={formAction} noValidate className="grid gap-4">
        <input type="hidden" name="next" value={next} />

        {state.message && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={Boolean(usernameError)}>
          <FieldLabel htmlFor="username">Kullanıcı adı</FieldLabel>
          <Input
            id="username"
            name="username"
            defaultValue={state.username}
            placeholder="E-posta adresi veya telefon numarası"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={Boolean(usernameError)}
          />
          {usernameError && <FieldError errors={[{ message: usernameError }]} />}
        </Field>

        <Field data-invalid={Boolean(passwordError)}>
          <FieldLabel htmlFor="password">Şifre</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            aria-invalid={Boolean(passwordError)}
          />
          {passwordError && <FieldError errors={[{ message: passwordError }]} />}
        </Field>

        <div className="flex justify-end">
          <Link href={ROUTES.forgotPassword} className="text-sm text-muted-foreground hover:text-primary">
            Şifremi unuttum
          </Link>
        </div>

        <Button type="submit" size="xl" className="w-full text-base font-bold" disabled={isPending} aria-busy={isPending}>
          {isPending && <Spinner />}
          Giriş Yap
        </Button>
      </form>

      <p className="mt-8 text-center text-muted-foreground">
        <Link href={ROUTES.register} className="hover:underline">
          Üye Değil Misiniz? <b className="font-bold text-primary">Şimdi Kaydolun</b>
        </Link>
      </p>
    </div>
  );
}
