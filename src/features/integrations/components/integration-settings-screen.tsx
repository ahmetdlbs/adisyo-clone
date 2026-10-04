"use client";

import { useState } from "react";
import Link from "next/link";
import { Plug } from "lucide-react";
import { toast } from "sonner";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/config/routes";
import { STATUS_HINTS, STATUS_LABELS, validateCredentials, type Integration } from "../model/integration";
import { disconnectIntegration, saveIntegration } from "../server/actions";

/** One card per delivery platform: bought? then its credentials form; not bought? a way to the store. */
export function IntegrationSettingsScreen({ integrations }: { integrations: readonly Integration[] }) {
  return (
    <PageContainer className="max-w-4xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Plug}
          title="Entegrasyon Bağlantıları"
          description="Paket sipariş platformlarının bağlantı bilgilerini buradan girin. Bilgiler şifrelenerek saklanır."
        />
        <PageBody className="grid gap-4 pt-4">
          {integrations.map((integration) => (
            <IntegrationCard key={`${integration.provider}-${integration.status}-${integration.fields.map((f) => f.isFilled).join("")}`} integration={integration} />
          ))}
        </PageBody>
      </PageCard>
    </PageContainer>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(integration.fields.map((field) => [field.name, field.value ?? ""]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateCredentials(integration.fields, values);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setIsSaving(true);
    try {
      await saveIntegration(integration.provider, result.credentials);
      toast.success("Bağlantı bilgileri kaydedildi");
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bağlantı bilgileri kaydedilemedi");
    } finally {
      setIsSaving(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectIntegration(integration.provider);
      toast.success("Bağlantı kaldırıldı");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bağlantı kaldırılamadı");
    }
  };

  const isSetUp = integration.status !== "DISCONNECTED";

  return (
    <section aria-label={integration.label} className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-foreground">{integration.label}</h2>
        <Badge variant={integration.status === "CONNECTED" ? "default" : "secondary"}>{STATUS_LABELS[integration.status]}</Badge>
      </div>

      {!integration.isAppActive ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Bu entegrasyonu kullanmak için önce Uygulama Mağazası&apos;ndan edinmelisiniz.</p>
          <Link href={`${ROUTES.appStore}?need=${integration.appKey}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Mağazaya git
          </Link>
        </div>
      ) : (
        <form onSubmit={save} noValidate className="grid gap-4">
          <p className="text-sm text-muted-foreground">{STATUS_HINTS[integration.status]}</p>
          {integration.fields.map((field) => {
            const id = `${integration.provider}-${field.name}`;
            return (
              <Field key={field.name}>
                <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
                <Input
                  id={id}
                  type={field.secret ? "password" : "text"}
                  autoComplete="off"
                  value={values[field.name] ?? ""}
                  placeholder={field.secret && field.isFilled ? "Kayıtlı — değiştirmek için yazın" : undefined}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, [field.name]: event.target.value }));
                    setMessage(null);
                  }}
                />
                <FieldDescription>{field.help}</FieldDescription>
              </Field>
            );
          })}
          {message && (
            <p role="alert" className="text-sm text-destructive">
              {message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            {isSetUp && (
              <Button type="button" variant="outline" onClick={disconnect}>
                Bağlantıyı kaldır
              </Button>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Spinner />}
              Kaydet
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
