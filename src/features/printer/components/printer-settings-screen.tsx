"use client";

import { useId, useState } from "react";
import { CheckCircle2, Download, PlayCircle, Plus, Printer, Settings, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageHeader } from "@/components/kit/page-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifyUnavailable } from "@/lib/notify";

type Tab = "printers" | "design";

const PRINTER_MODELS = [
  { value: "multi", title: "Birden Fazla Yazıcı (USB veya Ethernet)", description: "Ürün bazlı (mutfak, bar vb.) yazdırma" },
  { value: "single", title: "Tek Yazıcı (USB)", description: "Basit ve hızlı bağlantı" },
] as const;

function NoPrinterEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Empty className="min-h-[400px] flex-1 border bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/**
 * No printer can actually be defined here yet (there is no WebUSB/cloud-printer bridge in this demo), so both
 * tabs only show what the real screen would show with nothing configured, plus the setup links as no-ops.
 */
export function PrinterSettingsScreen() {
  const [tab, setTab] = useState<Tab>("printers");
  const [printerModel, setPrinterModel] = useState<(typeof PRINTER_MODELS)[number]["value"]>("multi");
  const radioGroupId = useId();

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center">
        <PageHeader icon={Printer} title="Yazıcı Ayarları" description="Yazıcı ile ilgili ayarlarınızı buradan yönetebilirsiniz" />
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList>
            <TabsTrigger value="printers">
              <Printer />
              Yazıcılar
            </TabsTrigger>
            <TabsTrigger value="design">
              <Settings />
              Çıktı Tasarımı
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "printers" ? (
        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-6">
            <p className="rounded-lg border bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
              Bu ekranda WebUSB ile bağlanan yazıcılar görüntülenmez. Bu yazıcıların çıktı ayarlarını &quot;Çıktı Tasarımı&quot; sekmesinden
              düzenleyebilirsiniz.
            </p>
            <NoPrinterEmptyState title="Tanımlı Yazıcı Bulunamadı." description="Lütfen ekranın sağ tarafında bulunan işlemleri sırasıyla yapınız" />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[380px]">
            <section className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b px-5 py-4 text-base font-semibold text-foreground">Yazıcı Modeli</h2>
              <RadioGroup value={printerModel} onValueChange={(value) => setPrinterModel(value as typeof printerModel)} className="flex flex-col gap-3 p-5">
                {PRINTER_MODELS.map((model) => {
                  const id = `${radioGroupId}-${model.value}`;
                  const isSelected = printerModel === model.value;
                  return (
                    <label
                      key={model.value}
                      htmlFor={id}
                      className={`relative flex cursor-pointer items-start gap-4 rounded-md border p-4 transition-colors ${isSelected ? "border-primary/40 bg-primary/5" : "hover:border-primary/30"}`}
                    >
                      <RadioGroupItem id={id} value={model.value} className="mt-1" />
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>{model.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{model.description}</p>
                      </div>
                      {isSelected && <CheckCircle2 aria-hidden="true" className="absolute top-4 right-4 text-primary" />}
                    </label>
                  );
                })}
              </RadioGroup>
            </section>

            <section className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b px-5 py-4 text-base font-semibold text-foreground">Keşfet</h2>
              <div className="flex flex-col gap-4 p-5">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Yazıcılarınızın kurulumu ve Adisyon Merkezi programına tanıtılması adımlarını anlattığımız videoyu izlemek için aşağıdaki bağlantıları
                  kullanabilirsiniz.
                </p>
                <Button variant="outline" className="justify-between" onClick={notifyUnavailable}>
                  Ethernet Bağlantılı Yazıcı Tanımlama
                  <PlayCircle className="text-primary" />
                </Button>
                <Button variant="outline" className="justify-between" onClick={notifyUnavailable}>
                  USB Bağlantılı Yazıcı Tanımlama
                  <PlayCircle className="text-primary" />
                </Button>
              </div>
            </section>

            <section className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b px-5 py-4 text-base font-semibold text-foreground">Kuruluma Başla</h2>
              <div className="flex flex-col gap-6 p-5">
                <SetupStep number={1} title="Bulut Yazıcı Programını İndir" description="Bilgisayarınıza tanımlı yazıcılar ile Adisyon Merkezi programı arasındaki iletişimi sağlar.">
                  <Button className="w-full" onClick={notifyUnavailable}>
                    <Download />
                    Bulut Yazıcı Programını İndir
                  </Button>
                </SetupStep>
                <SetupStep number={2} title="Yeni Yazıcı Ekle" description="Bulut yazıcı programını kurduktan sonra yeni yazıcınızı sisteme tanıtabilirsiniz.">
                  <Button className="w-full" onClick={notifyUnavailable}>
                    <Plus />
                    Yeni Yazıcı Ekle
                  </Button>
                </SetupStep>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <NoPrinterEmptyState
          title="Aktif yazıcı bulunamadı"
          description="Aktif bir yazıcı bulunamadığı için çıktı tasarımı oluşturulamadı. Lütfen bilgisayarınıza bağlı yazıcıları kontrol ediniz."
        />
      )}
    </div>
  );
}

function SetupStep({ number, title, description, children }: { number: number; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-10">
      <span aria-hidden="true" className="absolute top-0 left-0 flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {number}
      </span>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
