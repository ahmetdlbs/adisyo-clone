"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Download, FileText, PackageX, Plus } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { notifyUnavailable } from "@/lib/notify";

/**
 * Stock is not tracked anywhere in the app yet (`Product` carries no stock fields), so this screen only shows
 * the empty states and points the way to turning stock tracking on per product; nothing here is invented data.
 */
export function StockListScreen() {
  const [isEntryMode, setIsEntryMode] = useState(false);

  return (
    <PageContainer className="max-w-6xl">
      <PageCard>
        {isEntryMode ? (
          <>
            <PageHeader
              className="p-6"
              icon={FileText}
              title="Stok Giriş İşlemleri"
              description="Yeni ürün alımlarını sisteme işlemek ve maliyet takibi yapmak için bu ekranı kullanabilirsiniz."
              actions={
                <Button variant="ghost" onClick={() => setIsEntryMode(false)}>
                  <ArrowLeft />
                  Geri
                </Button>
              }
            />
            <PageBody className="pt-4">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <PackageX />
                  </EmptyMedia>
                  <EmptyTitle>Stok takibi aktif ürün bulunamadı</EmptyTitle>
                  <EmptyDescription>
                    Stok Girişi yapabilmek için önce{" "}
                    <Link href={ROUTES.productDefinition} className="font-medium text-primary hover:underline">
                      Menü / Ürünler
                    </Link>{" "}
                    ekranından ilgili ürünlerde stok takibini açmanız gerekiyor.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </PageBody>
          </>
        ) : (
          <>
            <PageHeader
              className="p-6"
              icon={FileText}
              title="Stok Listesi"
              description="Stok hareketlerini bu ekrandan detaylıca takip edebilirsiniz."
              actions={
                <>
                  <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                    <Download />
                    İndir
                  </Button>
                  <Button onClick={notifyUnavailable}>
                    <ClipboardList />
                    Stok Sayımı
                  </Button>
                  <Button onClick={() => setIsEntryMode(true)}>
                    <Plus />
                    Yeni Stok Girişi
                  </Button>
                </>
              }
            />
            <PageBody className="pt-4">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyDescription>Herhangi bir kayıt bulunamadı.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </PageBody>
          </>
        )}
      </PageCard>
    </PageContainer>
  );
}
