"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@/components/kit/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifyUnavailable } from "@/lib/notify";
import { filterByQuery } from "@/lib/search";
import { APP_CATEGORIES, APPS, appsInCategory, type AppListing, type CategoryId } from "../model/app-store";

type Tab = "store" | "installed";

export function AppStoreScreen() {
  const [tab, setTab] = useState<Tab>("store");
  const [category, setCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const inTab = tab === "installed" ? APPS.filter((app) => app.isInstalled) : APPS;
  const apps = filterByQuery(appsInCategory(inTab, category), query, (app) => app.name);
  const installedCount = APPS.filter((app) => app.isInstalled).length;

  return (
    <div className="flex h-full flex-col gap-8 overflow-auto p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Uygulama Mağazası</h1>
        <p className="text-sm text-muted-foreground">İşletmenizi büyütmek için ihtiyacınız olan tüm çözümleri tek noktadan yönetin.</p>

        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="mt-8">
          <TabsList variant="line">
            <TabsTrigger value="store">
              Mağaza <Badge variant="secondary">{APPS.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="installed">
              Kurulu Uygulamalarım <Badge variant="secondary">{installedCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav aria-label="Kategoriler" className="w-full shrink-0 lg:w-60">
          <h2 className="mb-3 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Kategoriler</h2>
          <div className="flex flex-col gap-1">
            {APP_CATEGORIES.map((item) => (
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

          {apps.length === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Bu kategoride henüz uygulama yok.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppCard({ app }: { app: AppListing }) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
          {app.name.charAt(0)}
        </div>
        <h3 className="text-[15px] leading-tight font-bold text-foreground">{app.name}</h3>
      </div>
      <p className="mb-5 flex-1 text-[13px] leading-relaxed text-muted-foreground">{app.description}</p>
      <div className="mt-auto flex items-center justify-between border-t pt-4">
        {app.price && <span className="text-[13px] font-bold text-foreground">{app.price}</span>}
        {app.isInstalled ? (
          <Button variant="outline" size="sm" className="ml-auto" onClick={notifyUnavailable}>
            Yönet
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="ml-auto" onClick={notifyUnavailable}>
            <Plus />
            Ekle
          </Button>
        )}
      </div>
    </div>
  );
}
