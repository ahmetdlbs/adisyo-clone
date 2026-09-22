"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { toast } from "sonner";
import { TextField } from "@/components/kit/form-fields";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileFormSchema, type ProfileFormValues } from "../model/profile";

const TABS = ["Kullanıcı Bilgileri", "Parola Değişikliği", "Gizlilik ve Güvenlik", "Dil ve Bölge Ayarları"] as const;

interface ProfileScreenProps {
  initialProfile?: ProfileFormValues;
}

const DEFAULT_PROFILE: ProfileFormValues = { firstName: "", lastName: "", phone: "", email: "", pin: "" };

/** Only "Kullanıcı Bilgileri" ever had a form behind it in the original; the other tabs still switch (the active
 * underline moves) but never swapped in content there either, so nothing here pretends otherwise. */
export function ProfileScreen({ initialProfile = DEFAULT_PROFILE }: ProfileScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const form = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema), defaultValues: initialProfile });

  const submit = form.handleSubmit(() => toast.success("Profil güncellendi"));

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-auto p-6">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <PageHeader className="mb-8" icon={User} title="Profil" description="Kullanıcı bilgilerinizi güncelleyebilirsiniz." />

        <Tabs value={tab} onValueChange={(value) => setTab(value as (typeof TABS)[number])} className="mb-8">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <TextField control={form.control} name="firstName" label="İsim" required autoFocus />
            <TextField control={form.control} name="lastName" label="Soyisim" required />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <TextField control={form.control} name="phone" label="Telefon Numarası" type="tel" inputMode="tel" required />
            <TextField control={form.control} name="email" label="Email" type="email" required />
          </div>
          <TextField control={form.control} name="pin" label="Pin Numarası (0 ile başlayamaz)" inputMode="numeric" />

          <div className="flex justify-end">
            <Button type="submit">Güncelle</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
