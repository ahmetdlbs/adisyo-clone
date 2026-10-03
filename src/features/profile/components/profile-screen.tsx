"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { toast } from "sonner";
import { TextField } from "@/components/kit/form-fields";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileFormSchema, type ProfileFormValues } from "../model/profile";
import { updateProfile } from "../server/actions";

const TABS = ["Kullanıcı Bilgileri", "Parola Değişikliği", "Gizlilik ve Güvenlik", "Dil ve Bölge Ayarları"] as const;

interface ProfileScreenProps {
  initialProfile: ProfileFormValues;
  /** Whether a PIN is already set; the PIN itself is stored hashed and never shown. */
  hasPin?: boolean;
}

/** Only "Kullanıcı Bilgileri" ever had a form behind it in the original; the other tabs still switch (the active
 * underline moves) but never swapped in content there either, so nothing here pretends otherwise. */
export function ProfileScreen({ initialProfile, hasPin = false }: ProfileScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [pinIsSet, setPinIsSet] = useState(hasPin);
  const [removePin, setRemovePin] = useState(false);
  const form = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema), defaultValues: initialProfile });

  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = await updateProfile(values, { removePin });
      setPinIsSet(saved.hasPin);
      setRemovePin(false);
      form.setValue("pin", "");
      toast.success("Profil güncellendi");
    } catch (error) {
      // The only thing that can conflict here is the email (it must stay unique), so the API's message
      // belongs on that field, same as every other "name already taken" form in this app.
      form.setError("email", { message: error instanceof Error ? error.message : "Profil güncellenemedi" });
    }
  });

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
          <TextField
            control={form.control}
            name="pin"
            label="Pin Numarası (0 ile başlayamaz)"
            inputMode="numeric"
            autoComplete="off"
            placeholder={pinIsSet ? "••••" : undefined}
            description={pinIsSet ? "Bir PIN tanımlı. Değiştirmek için yenisini yazın, boş bırakırsanız aynı kalır." : "PIN güvenlik için saklanır ve tekrar gösterilmez."}
          />
          {pinIsSet && (
            <span className="flex items-center gap-2 text-sm">
              <Checkbox aria-label="PIN'i kaldır" checked={removePin} onCheckedChange={(checked) => setRemovePin(checked === true)} />
              PIN&apos;i kaldır
            </span>
          )}

          <div className="flex justify-end">
            <Button type="submit">Güncelle</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
