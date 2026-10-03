"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/kit/page";
import { Switch } from "@/components/ui/switch";
import { createEmptyServiceSettings, type ServiceSettings } from "../model/service-charge";
import { saveGarsoniye, saveKuver } from "../server/actions";
import { ServiceChargeCard } from "./service-charge-card";

interface ServiceOperationsScreenProps {
  settings?: ServiceSettings;
}

/** Kuver (cover) and garsoniye (service) charge definitions, each optionally added to every new order automatically. */
export function ServiceOperationsScreen({ settings = createEmptyServiceSettings() }: ServiceOperationsScreenProps) {
  const [useDefinitions, setUseDefinitions] = useState(true);

  const save = (action: typeof saveKuver, noun: string) => async (charge: Parameters<typeof saveKuver>[0]) => {
    try {
      await action(charge);
      toast.success(`${noun} ayarları kaydedildi`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${noun} ayarları kaydedilemedi`);
    }
  };

  return (
    <PageContainer className="max-w-5xl gap-6">
      <h1 className="sr-only">Servis İşlemleri</h1>

      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
        <span className="text-sm font-medium text-foreground">Kuver/Garsoniye tanımlamaları kullanılsın.</span>
        <Switch
          aria-label="Kuver/Garsoniye tanımlamaları kullanılsın."
          checked={useDefinitions}
          onCheckedChange={setUseDefinitions}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ServiceChargeCard title="Kuver Ayarları" noun="Kuver" charge={settings.kuver} onSave={save(saveKuver, "Kuver")} />
        <ServiceChargeCard title="Garsoniye Ayarları" noun="Garsoniye" charge={settings.garsoniye} onSave={save(saveGarsoniye, "Garsoniye")} />
      </div>
    </PageContainer>
  );
}
