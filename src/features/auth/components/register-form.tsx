"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CheckboxField, SelectField, TextField } from "@/components/kit/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/config/routes";
import { registerAction } from "../server/actions";
import {
  COUNTRY_CODE_OPTIONS,
  registerSchema,
  type RegisterFormInput,
  type RegisterFormValues,
} from "../model/register";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      restaurantName: "",
      fullName: "",
      email: "",
      countryCode: "+90",
      phone: "",
      password: "",
      passwordConfirm: "",
      acceptedTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerAction(values);
    if (result.ok) {
      router.push(ROUTES.dashboard);
      return;
    }
    // A taken e-mail belongs on the e-mail field; anything else (outage, rate limit) is a form-level message.
    if (result.field) form.setError(result.field, { message: result.message });
    else form.setError("root", { message: result.message });
  };

  return (
    <div>
      <h1 className="text-[26px] font-semibold">Adisyon Merkezi&apos;ne hoş geldiniz</h1>
      <p className="mt-2 mb-8 text-muted-foreground">Hemen kaydolun, 15 Gün boyunca ücretsiz deneyin!</p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField control={form.control} name="restaurantName" label="Restoran Adı" autoComplete="organization" />
          <TextField control={form.control} name="fullName" label="İsim Soyisim" autoComplete="name" />
          <TextField control={form.control} name="email" label="Güncel Mail Adresiniz" type="email" autoComplete="email" />

          <div className="grid grid-cols-[110px_1fr] items-start gap-2">
            <SelectField control={form.control} name="countryCode" label="Ülke Kodu" options={COUNTRY_CODE_OPTIONS} />
            <TextField
              control={form.control}
              name="phone"
              label="Cep Telefonu"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
            />
          </div>

          <TextField control={form.control} name="password" label="Şifre" type="password" autoComplete="new-password" />
          <TextField
            control={form.control}
            name="passwordConfirm"
            label="Şifre Tekrar"
            type="password"
            autoComplete="new-password"
          />

          <CheckboxField
            control={form.control}
            name="acceptedTerms"
            label="Kullanım Sözleşmesi ve Aydınlatma Metni'ni okudum, kabul ediyorum"
            description={
              <>
                {/* TODO(legal): link the real documents once they exist. */}
                Metinler: <Link href="#" className="font-semibold underline underline-offset-2">Kullanım Sözleşmesi</Link>,{" "}
                <Link href="#" className="font-semibold underline underline-offset-2">Aydınlatma Metni</Link>
              </>
            }
          />

          {form.formState.errors.root && (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button type="submit" size="xl" className="w-full text-base" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            Kayıt Ol
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Üye Misiniz?{" "}
        <Link href={ROUTES.login} className="font-bold text-primary hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
