"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Info, Plus } from "lucide-react";
import { toast } from "sonner";
import { SearchInput } from "@/components/kit/search-input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatKurus } from "@/lib/money";
import { filterByQuery } from "@/lib/search";
import {
  appRoute,
  appsInCategory,
  categoryOptions,
  isInstalled,
  isIntegrationApp,
  renewalDate,
  type AppEntitlement,
  type CatalogApp,
  type CategoryId,
} from "../model/app-store";
import { purchaseApp } from "../server/actions";

type Tab = "store" | "installed";

interface AppStoreScreenProps {
  apps: readonly CatalogApp[];
  /** Keys of the apps usable right now (the API already accounts for expiry). */
  activeKeys: readonly string[];
  /** Purchase records, used only to show when a purchase renews. Empty for roles that cannot see billing. */
  entitlements: readonly AppEntitlement[];
  /** Set when a screen sent the user here because its app is missing. */
  needKey?: string;
}

export function AppStoreScreen({ apps, activeKeys, entitlements, needKey }: AppStoreScreenProps) {
  const active = useMemo(() => new Set(activeKeys), [activeKeys]);
  const neededApp = needKey ? apps.find((app) => app.key === needKey) : undefined;
  const [tab, setTab] = useState<Tab>("store");
  const [category, setCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const installedApps = apps.filter((app) => isInstalled(app, active));
  const inTab = tab === "installed" ? installedApps : apps;
  const visibleApps = filterByQuery(appsInCategory(inTab, category), query, (app) => app.name);

  return (
    <div className="flex h-full flex-col gap-8 overflow-auto p-8">
      <div>
        {neededApp && !isInstalled(neededApp, active) && (
          <Alert className="mb-6">
            <Info />
            <AlertTitle>Bu ekran için &quot;{neededApp.name}&quot; gerekiyor</AlertTitle>
            <AlertDescription>
              {neededApp.isAvailable
                ? "Aşağıdan ekleyin; satın alır almaz menünüzde görünür."
                : "Bu uygulama henüz satışta değil."}
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Uygulama Mağazası</h1>
        <p className="text-sm text-muted-foreground">İşletmenizi büyütmek için ihtiyacınız olan tüm çözümleri tek noktadan yönetin.</p>

        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="mt-8">
          <TabsList variant="line">
            <TabsTrigger value="store">
              Mağaza <Badge variant="secondary">{apps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="installed">
              Kurulu Uygulamalarım <Badge variant="secondary">{installedApps.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav aria-label="Kategoriler" className="w-full shrink-0 lg:w-60">
          <h2 className="mb-3 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Kategoriler</h2>
          <div className="flex flex-col gap-1">
            {categoryOptions(apps).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                aria-pressed={category === item.id}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                  category === item.id ? "bg-foreground text-background shadow-sm" : "text-foreground hover:bg-muted"
                }`}
              >
                <span>{item.label}</span>
                <Badge variant={category === item.id ? "secondary" : "outline"}>{item.count}</Badge>
              </button>
            ))}
          </div>
        </nav>

        <div className="flex flex-1 flex-col gap-6">
          <SearchInput value={query} onValueChange={setQuery} placeholder="Entegre etmek istediğiniz platformu bulun..." aria-label="Uygulama ara" />

          {visibleApps.length === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Bu kategoride henüz uygulama yok.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleApps.map((app) => (
                <AppCard key={app.id} app={app} installed={isInstalled(app, active)} renewsAt={renewalDate(app, entitlements)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppCard({ app, installed, renewsAt }: { app: CatalogApp; installed: boolean; renewsAt: string | null }) {
  const [isPending, startTransition] = useTransition();

  function handlePurchase() {
    startTransition(async () => {
      const result = await purchaseApp(app.id);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  const route = appRoute(app);

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
          {app.name.charAt(0)}
        </div>
        <h3 className="flex-1 text-[15px] leading-tight font-bold text-foreground">{app.name}</h3>
        {installed && <Badge variant="secondary">Kurulu</Badge>}
        {!app.isAvailable && <Badge variant="outline">Yakında</Badge>}
      </div>
      <p className="mb-5 flex-1 text-[13px] leading-relaxed text-muted-foreground">{app.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 border-t pt-4">
        {installed && renewsAt ? (
          <span className="text-xs text-muted-foreground">Yenileme: {new Date(renewsAt).toLocaleDateString("tr-TR")}</span>
        ) : (
          !app.isCore && <span className="text-[13px] font-bold text-foreground">{formatKurus(app.monthlyPrice)} / ay</span>
        )}
        {installed ? (
          route ? (
            <Link href={route} className={buttonVariants({ variant: "outline", size: "sm", className: "ml-auto" })}>
              {isIntegrationApp(app) ? "Kurulum" : "Aç"}
              <ArrowRight />
            </Link>
          ) : null
        ) : (
          <Button variant="outline" size="sm" className="ml-auto" disabled={isPending || !app.isAvailable} onClick={handlePurchase}>
            <Plus />
            Ekle
          </Button>
        )}
      </div>
    </div>
  );
}
