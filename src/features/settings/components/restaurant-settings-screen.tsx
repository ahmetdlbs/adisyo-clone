"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifyUnavailable } from "@/lib/notify";
import {
  restaurantSettingsFormSchema,
  type RestaurantSettingsFormInput,
  type RestaurantSettingsFormValues,
} from "../model/restaurant-settings";
import { updateRestaurantSettings } from "../server/actions";

const TABS = ["Genel Ayarlar", "Ödeme Tipleri", "Parametreler", "Döviz Ayarları", "Adres Bilgileri", "Entegrasyon"] as const;
const NOTIFICATION_SOUND_OPTIONS = [
  { value: "1", label: "Ses 1" },
  { value: "2", label: "Ses 2" },
];
const WORK_MODE_OPTIONS = [{ value: "all", label: "Masa Siparişi, Paket Sipariş, Gel Al Sipariş" }];

interface RestaurantSettingsScreenProps {
  initialSettings: RestaurantSettingsFormInput;
}

/** Only "Genel Ayarlar" ever had a form behind it in the original; the other tabs still switch (the active
 * underline moves) but never swapped in content there either, so nothing here pretends otherwise. */
export function RestaurantSettingsScreen({ initialSettings }: RestaurantSettingsScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const form = useForm<RestaurantSettingsFormInput, unknown, RestaurantSettingsFormValues>({
    resolver: zodResolver(restaurantSettingsFormSchema),
    defaultValues: initialSettings,
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await updateRestaurantSettings(values);
      toast.success("Ayarlar güncellendi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ayarlar güncellenemedi");
    }
  });

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-6 overflow-auto p-6">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Restaurant Tanımlamaları</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Restaurantınız ile ilgili tanımlamaları bu alandan yapabilirsiniz.</p>
          </div>
          <Button type="submit" form="restaurant-settings-form">
            Güncelle
          </Button>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(value as (typeof TABS)[number])} className="mb-8">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <form id="restaurant-settings-form" onSubmit={submit} noValidate className="flex flex-col gap-6">
          <TextField control={form.control} name="name" label="Restaurant Adı" required />
          <div className="grid grid-cols-2 gap-6">
            <TextField control={form.control} name="dayStart" label="Gün Başlangıç" required />
            <TextField control={form.control} name="dayEnd" label="Gün Bitiş" required />
          </div>
          <div className="grid grid-cols-2 items-end gap-6">
            <SelectField control={form.control} name="notificationSound" label="Bildirim Sesi" options={NOTIFICATION_SOUND_OPTIONS} />
            <Button type="button" variant="link" className="h-auto justify-start p-0 text-primary" onClick={notifyUnavailable}>
              Dene
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <TextField
              control={form.control}
              name="lockSeconds"
              label="Ekran kilit süresi (sn) (0 girilir ise devre dışı kalır)"
              inputMode="numeric"
              required
            />
            <TextField control={form.control} name="firstOrderNumber" label="İlk sipariş numarası (0-9999)" inputMode="numeric" required />
          </div>
          <div className="grid grid-cols-2 items-end gap-6">
            <SelectField control={form.control} name="workMode" label="Çalışma Tipleri" options={WORK_MODE_OPTIONS} />
            <Button type="button" variant="link" className="h-auto justify-center p-0 text-primary" onClick={notifyUnavailable}>
              Konumu Kaydet
            </Button>
          </div>
          <Button type="button" variant="link" className="h-auto w-fit justify-start p-0 text-primary" onClick={notifyUnavailable}>
            Gelir Merkezlerini Düzenle
          </Button>
        </form>
      </div>
    </div>
  );
}
