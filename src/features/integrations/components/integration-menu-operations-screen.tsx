"use client";

import { useId, useState } from "react";
import { ChevronDown, Info, Search, SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/kit/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLUMN_COUNT = 5;

const MARKETPLACES = [
  { value: "yemeksepeti", label: "Yemeksepeti" },
  { value: "getir", label: "Getir Yemek" },
  { value: "trendyol", label: "Trendyol Yemek" },
];

const CATEGORIES = [
  { value: "ana-yemek", label: "Ana Yemek" },
  { value: "icecek", label: "İçecekler" },
  { value: "tatli", label: "Tatlılar" },
];

/** No brand is connected to a delivery-platform integration in this demo, so the table is always empty; the
 * filter/status/brand panels below still open and can be set, same as the original screen. */
export function IntegrationMenuOperationsScreen() {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [marketplace, setMarketplace] = useState("");
  const [category, setCategory] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusActive, setStatusActive] = useState(true);
  const [statusPassive, setStatusPassive] = useState(true);
  const [isBrandPickerOpen, setIsBrandPickerOpen] = useState(false);
  const brandSearchId = useId();

  const statusLabel = statusActive && statusPassive ? "Aktif, Pasif" : statusActive ? "Aktif" : statusPassive ? "Pasif" : "Yok";
  const clearFilters = () => {
    setMarketplace("");
    setCategory("");
    setIsFilterOpen(false);
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <SearchInput className="max-w-2xl flex-1" value={query} onValueChange={setQuery} placeholder="Ürün Ara" aria-label="Ürün ara" />
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger render={<Button variant="secondary" size="icon" aria-label="Filtrele" />}>
              <SlidersHorizontal />
            </PopoverTrigger>
            <PopoverContent aria-label="Filtrele" className="w-96">
              <div className="flex flex-col gap-5">
                <Field orientation="horizontal" className="items-center gap-4">
                  <span className="w-28 shrink-0 text-sm font-bold text-foreground">Pazar Yeri:</span>
                  <Select items={MARKETPLACES} value={marketplace} onValueChange={(value) => setMarketplace(String(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pazar Yerleri" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARKETPLACES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field orientation="horizontal" className="items-center gap-4">
                  <span className="w-28 shrink-0 text-sm font-bold text-foreground">Ürün Kategorisi:</span>
                  <Select items={CATEGORIES} value={category} onValueChange={(value) => setCategory(String(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kategoriler" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex items-center justify-end gap-4">
                  <Button variant="ghost" className="text-primary" onClick={clearFilters}>
                    Temizle
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>Uygula</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
            <PopoverTrigger render={<Button variant="outline" />}>
              {`Ürün Durumu: ${statusLabel}`}
              <ChevronDown />
            </PopoverTrigger>
            <PopoverContent aria-label={`Ürün Durumu: ${statusLabel}`} className="w-48">
              <div className="flex flex-col gap-1">
                <Field orientation="horizontal" className="items-center justify-between">
                  <FieldLabel>Aktif</FieldLabel>
                  <Checkbox checked={statusActive} onCheckedChange={(checked) => setStatusActive(checked === true)} aria-label="Aktif" />
                </Field>
                <Field orientation="horizontal" className="items-center justify-between">
                  <FieldLabel>Pasif</FieldLabel>
                  <Checkbox checked={statusPassive} onCheckedChange={(checked) => setStatusPassive(checked === true)} aria-label="Pasif" />
                </Field>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={() => setIsBrandPickerOpen(true)}>
            Marka Seç
            <ChevronDown />
          </Button>
        </div>
      </div>

      <p className="text-sm font-medium text-foreground">
        Tüm markalarınıza ait ürünler listelenmiştir. Burada, yalnızca ürün durum değişikliğini destekleyen entegratörlere yönelik işlem yapılabilmektedir.
      </p>

      <div className="max-h-[600px] flex-1 overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableCaption className="sr-only">Entegrasyon ürünleri</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox aria-label="Tümünü seç" />
              </TableHead>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Entegrasyon</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Satışa Açık/Kapalı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} className="bg-muted/30 py-8">
                <div className="flex items-center gap-3">
                  <div aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Info className="size-4" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">
                    Ekranda gösterilecek veri bulunamadı. Marka seçimi ve uygulanan filtreleri kontrol ediniz.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Dialog open={isBrandPickerOpen} onOpenChange={setIsBrandPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Marka Seçimi</DialogTitle>
            <DialogDescription>Ürünlerinizin listeleceği markayı seçiniz.</DialogDescription>
          </DialogHeader>

          <InputGroup>
            <InputGroupInput id={brandSearchId} placeholder="Arama" aria-label="Marka ara" />
            <InputGroupAddon align="inline-end">
              <Search aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>

          <RadioGroup defaultValue="ana-kanal" className="max-h-48 overflow-y-auto">
            <Field orientation="horizontal" className="items-center gap-3">
              <RadioGroupItem id="brand-ana-kanal" value="ana-kanal" />
              <FieldLabel htmlFor="brand-ana-kanal">Ana Kanal</FieldLabel>
            </Field>
          </RadioGroup>

          <div className="flex items-center justify-end gap-4 pt-2">
            <DialogClose render={<Button variant="ghost" className="text-primary" />}>İptal</DialogClose>
            <Button onClick={() => setIsBrandPickerOpen(false)}>Seç</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
