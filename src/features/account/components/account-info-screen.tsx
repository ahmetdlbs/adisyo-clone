"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { Progress } from "@/components/ui/progress";
import { notifyUnavailable } from "@/lib/notify";

const COLUMNS: readonly DataTableColumn<never>[] = [
  { id: "status", header: "DURUMU", cell: () => null },
  { id: "plan", header: "PLAN", cell: () => null },
  { id: "integrations", header: "ENTEGRASYONLAR", cell: () => null },
  { id: "amount", header: "TUTAR", cell: () => null },
  { id: "date", header: "ÖDEME TARİHİ", cell: () => null },
  { id: "method", header: "ÖDEME TİPİ", cell: () => null },
];

/** Subscription plan and billing. No billing backend exists yet, so every action here just says it is not available. */
export function AccountInfoScreen() {
  return (
    <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-6 overflow-auto p-6 lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card shadow-sm">
          <h2 className="px-6 py-4 text-[14px] font-bold tracking-wider text-foreground uppercase">Hesabınız</h2>
          <div className="px-6 pb-6">
            <div className="rounded-lg bg-muted/50 p-5">
              <p className="text-xs text-muted-foreground">Aktif Paketiniz</p>
              <h3 className="text-base font-bold text-foreground">Trial paket</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Sınırsız Kullanıcı</p>
              <div className="my-4 h-px bg-border" />
              <dl className="mb-6 flex flex-col gap-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-foreground">Üyelik Tarihiniz</dt>
                  <dd className="text-foreground">19.09.2026 16:21</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-foreground">Üyelik Bitiş Tarihiniz</dt>
                  <dd className="text-foreground">05.10.2026 10:21</dd>
                </div>
              </dl>
              <Progress value={6} aria-label="Deneme süresi kullanımı" />
              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span>Kullanılan 1 gün (%6)</span>
                <span>Kalan 14 gün (%93)</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={notifyUnavailable}>
              Süreyi Uzat/Ödeme Yap
            </Button>
          </div>
        </section>

        <section className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-[14px] font-bold tracking-wider text-foreground uppercase">Ödeme Yönetimi</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={notifyUnavailable}>
              <Pencil />
              Düzenle
            </Button>
          </div>
          <div className="flex flex-col gap-5 px-6 pb-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Ödeme Metodu</h3>
              <Button variant="link" className="h-auto p-0 text-primary" onClick={notifyUnavailable}>
                <span aria-hidden="true">+</span> Kartınızı Kaydedin
              </Button>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Kartınızı kaydedin, ödemelerinizi hızlı ve zahmetsiz yapın.</p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Talimat Detayları</h3>
              <Button variant="link" className="h-auto p-0 text-primary" onClick={notifyUnavailable}>
                <span aria-hidden="true">+</span> Otomatik Ödeme Talimatı Verin
              </Button>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Belirlediğiniz karttan düzenli tahsilat yapılır; ödeme gecikmesi ya da hizmet kesintisi riski ortadan kalkar.
              </p>
            </div>
            <div className="h-px bg-border" />
            <h3 className="text-sm font-semibold text-foreground">Fatura Bilgileri</h3>
          </div>
        </section>
      </div>

      <section className="h-fit min-h-[500px] rounded-xl border bg-card shadow-sm">
        <h2 className="px-6 py-4 text-[14px] font-bold tracking-wider text-foreground uppercase">Ödemeler</h2>
        <DataTable columns={COLUMNS} rows={[]} getRowId={() => ""} caption="Ödemeler" emptyMessage="Kayıtlı ödeme bulunamadı!" />
      </section>
    </div>
  );
}
