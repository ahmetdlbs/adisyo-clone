"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { formatDate } from "@/lib/format";
import { formatKurus } from "@/lib/money";
import { notifyUnavailable } from "@/lib/notify";
import {
  paymentStatusLabel,
  summarizeEntitlements,
  type AccountEntitlement,
  type AccountPayment,
} from "../model/account";

const COLUMNS: readonly DataTableColumn<AccountPayment>[] = [
  { id: "status", header: "DURUMU", cell: (payment) => paymentStatusLabel(payment.status) },
  { id: "amount", header: "TUTAR", align: "right", cell: (payment) => formatKurus(payment.amount) },
  { id: "date", header: "ÖDEME TARİHİ", cell: (payment) => formatDate(payment.createdAt) },
  { id: "method", header: "ÖDEME TİPİ", cell: (payment) => payment.provider },
];

interface AccountInfoScreenProps {
  entitlements: readonly AccountEntitlement[];
  payments: readonly AccountPayment[];
}

/**
 * "Aktif Paketiniz" and "Ödemeler" are real (api/'s billing module); saving a card, an auto-payment
 * instruction and invoice details stay mocked — there is no real payment gateway behind this app by design.
 */
export function AccountInfoScreen({ entitlements, payments }: AccountInfoScreenProps) {
  const summary = summarizeEntitlements(entitlements);

  return (
    <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-6 overflow-auto p-6 lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card shadow-sm">
          <h2 className="px-6 py-4 text-[14px] font-bold tracking-wider text-foreground uppercase">Hesabınız</h2>
          <div className="px-6 pb-6">
            <div className="rounded-lg bg-muted/50 p-5">
              <p className="text-xs text-muted-foreground">Aktif Uygulamalarınız</p>
              <h3 className="text-base font-bold text-foreground">
                {summary.activeCount > 0 ? `${summary.activeCount} uygulama aktif` : "Aktif uygulamanız yok"}
              </h3>
              {summary.nearestExpiry && (
                <>
                  <div className="my-4 h-px bg-border" />
                  <dl className="text-[13px]">
                    <div className="flex items-center justify-between">
                      <dt className="font-medium text-foreground">En Yakın Yenileme Tarihi</dt>
                      <dd className="text-foreground">{formatDate(summary.nearestExpiry)}</dd>
                    </div>
                  </dl>
                </>
              )}
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
        <DataTable columns={COLUMNS} rows={payments} getRowId={(payment) => payment.id} caption="Ödemeler" emptyMessage="Kayıtlı ödeme bulunamadı!" />
      </section>
    </div>
  );
}
