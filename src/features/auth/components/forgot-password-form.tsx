"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/config/routes";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../model/register";

export function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // TODO(backend): request the reset e-mail. Until one exists the demo only shows the confirmation.
  const onSubmit = () => setIsSent(true);

  return (
    <div className="flex flex-col">
      <h1 className="mb-2 text-[26px] font-semibold">Şifremi Unuttum</h1>
      <p className="mb-8 text-muted-foreground">
        Lütfen kayıtlı e-posta adresinizi girin. Şifrenizi sıfırlamanız için size bir bağlantı göndereceğiz.
      </p>

      {isSent ? (
        <Alert role="status">
          <AlertTitle>E-posta gönderildi!</AlertTitle>
          <AlertDescription>
            Lütfen gelen kutunuzu kontrol edin ve e-postadaki bağlantıya tıklayarak şifrenizi sıfırlayın.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <TextField control={form.control} name="email" label="E-posta adresiniz" type="email" autoComplete="email" />
            <Button type="submit" size="xl" className="w-full text-base font-bold">
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>
          </FieldGroup>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href={ROUTES.login}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Giriş ekranına dön
        </Link>
      </div>
    </div>
  );
}
