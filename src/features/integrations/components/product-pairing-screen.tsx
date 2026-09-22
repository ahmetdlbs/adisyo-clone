"use client";

import { useState } from "react";
import { Info, List, Redo2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/kit/page-header";
import { SearchInput } from "@/components/kit/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VAT_GROUPS = [
  { value: "yiyecek", label: "Yiyecek (%10)" },
  { value: "icecek", label: "İçecek (%20)" },
];

/** No delivery-platform integration is actually connected in this demo, so both lists are always empty; the two
 * panels below only pick what a pairing run *would* use once one is, same as the original screen. */
export function ProductPairingScreen() {
  const [integrationQuery, setIntegrationQuery] = useState("");
  const [adisyoQuery, setAdisyoQuery] = useState("");
  const [showPairedIntegration, setShowPairedIntegration] = useState(false);
  const [showPairedAdisyo, setShowPairedAdisyo] = useState(false);
  const [isIntegrationPickerOpen, setIsIntegrationPickerOpen] = useState(false);
  const [isAutoAddOpen, setIsAutoAddOpen] = useState(false);
  const [vatGroup, setVatGroup] = useState("yiyecek");
  const [removeExistingPairs, setRemoveExistingPairs] = useState(false);

  const saveAutoAdd = () => {
    setIsAutoAddOpen(false);
    toast.success("Ayarlar kaydedildi");
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6 md:flex-row">
      <section className="flex min-h-[500px] flex-1 flex-col rounded border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-start xl:justify-between">
          <PageHeader icon={List} title="Entegrasyon Ürünleri" description="Entegrasyondaki ürünlerin listesi" />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => setIsIntegrationPickerOpen(true)}>
              Entegrasyon Değiştir
            </Button>
            <Popover open={isAutoAddOpen} onOpenChange={setIsAutoAddOpen}>
              <PopoverTrigger render={<Button>Ürünleri Otomatik Ekle</Button>} />
              <PopoverContent align="end" className="w-80">
                <PopoverTitle>Ürünleri Otomatik Ekle</PopoverTitle>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Ürün KDV Grubu</span>
                    <Select items={VAT_GROUPS} value={vatGroup} onValueChange={(value) => setVatGroup(String(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VAT_GROUPS.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Field orientation="horizontal" className="items-center">
                    <Checkbox id="remove-existing-pairs" checked={removeExistingPairs} onCheckedChange={(checked) => setRemoveExistingPairs(checked === true)} />
                    <FieldLabel htmlFor="remove-existing-pairs">Mevcut eşleşmeleri kaldır</FieldLabel>
                  </Field>

                  <div className="flex items-center justify-end gap-3">
                    <Button variant="ghost" className="text-primary" onClick={() => setIsAutoAddOpen(false)}>
                      <Redo2 />
                      İptal
                    </Button>
                    <Button onClick={saveAutoAdd}>
                      <Save />
                      Kaydet
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-3 rounded border bg-muted/30 p-4">
            <div aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Info className="size-4" />
            </div>
            <span className="text-sm font-bold text-foreground">Yapacağınız eşleştirmeler merkezi olarak yapılacaktır!</span>
          </div>

          <SearchInput value={integrationQuery} onValueChange={setIntegrationQuery} placeholder="Arama" aria-label="Entegrasyon ürünü ara" />

          <Field orientation="horizontal" className="items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Checkbox id="paired-integration" checked={showPairedIntegration} onCheckedChange={(checked) => setShowPairedIntegration(checked === true)} />
              <FieldLabel htmlFor="paired-integration">Eşleştirilmiş Ürünleri Göster</FieldLabel>
            </div>
            <span className="text-xs font-medium text-muted-foreground">0 adet kayıt bulundu</span>
          </Field>

          <p className="text-sm font-medium text-foreground">Bütün ürünler eşleştirilmiştir</p>
        </div>
      </section>

      <section className="flex min-h-[500px] flex-1 flex-col rounded border bg-card shadow-sm">
        <PageHeader className="border-b p-5" icon={List} title="Adisyo Ürünler" description="Adisyo Ürün Listesi" />
        <div className="flex flex-col gap-5 p-5">
          <SearchInput value={adisyoQuery} onValueChange={setAdisyoQuery} placeholder="Arama" aria-label="Adisyo ürünü ara" />
          <Field orientation="horizontal" className="items-center border-b pb-3">
            <Checkbox id="paired-adisyo" checked={showPairedAdisyo} onCheckedChange={(checked) => setShowPairedAdisyo(checked === true)} />
            <FieldLabel htmlFor="paired-adisyo">Eşleştirilmiş Ürünleri Göster</FieldLabel>
          </Field>
        </div>
      </section>

      <Dialog open={isIntegrationPickerOpen} onOpenChange={setIsIntegrationPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <DialogTitle>Entegrasyonlar</DialogTitle>
            <DialogDescription>Lütfen eşleştirme yapacağınız entegrasyonu seçiniz</DialogDescription>
          </DialogHeader>
          <p className="py-8 text-center text-sm text-muted-foreground">Bu hesaba bağlı bir entegrasyon bulunmuyor.</p>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" className="text-primary" />}>Kapat</DialogClose>
            <Button onClick={() => setIsIntegrationPickerOpen(false)}>Devam Et</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
