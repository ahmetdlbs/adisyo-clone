"use client";

import { useState, useTransition } from "react";
import { Info, Save, User } from "lucide-react";
import { toast } from "sonner";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { SearchInput } from "@/components/kit/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { filterByQuery } from "@/lib/search";
import { PERMISSIONS, RIGHTS_ROLES, togglePermission, type PermissionGrants } from "../model/permission";
import { saveGrants } from "../server/actions";

interface RightsScreenProps {
  initialGrants?: PermissionGrants;
}

/** Grid of which role may do what. Toggling a cell only changes local state; "Kaydet" commits the whole grid at once. */
export function RightsScreen({ initialGrants = {} }: RightsScreenProps) {
  const [grants, setGrants] = useState(initialGrants);
  const [query, setQuery] = useState("");
  const [isSaving, startSaving] = useTransition();

  const handleSave = () => {
    startSaving(async () => {
      try {
        await saveGrants(grants);
        toast.success("Yetkiler kaydedildi");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Yetkiler kaydedilemedi");
      }
    });
  };

  const permissions = filterByQuery(PERMISSIONS, query, (permission) => `${permission.title} ${permission.description}`);

  return (
    <PageContainer className="max-w-6xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={User}
          title="Yetki / İzin Ekranı"
          description="Kullanıcılarınızın yetkilerini/izinlerini buradan güncelleyebilirsiniz"
          actions={
            <Button onClick={handleSave} disabled={isSaving}>
              <Save />
              Kaydet
            </Button>
          }
        />
        <PageToolbar>
          <SearchInput className="w-96" value={query} onValueChange={setQuery} placeholder="Yetki ara" aria-label="Yetki ara" />
        </PageToolbar>
        <PageBody className="pt-4">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Yetkiler</caption>
            <thead>
              <tr className="border-b bg-muted/50">
                <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">
                  Restaurant Tanım Yetkilendirmeleri
                </th>
                {RIGHTS_ROLES.map((role) => (
                  <th key={role} scope="col" className="w-20 px-3 py-3 text-center font-medium text-foreground">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={RIGHTS_ROLES.length + 1} className="py-10 text-center text-muted-foreground">
                    Aranan kriterlere uygun yetki bulunamadı.
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="border-b">
                    <td className="px-4 py-4 align-top">
                      <div className="flex gap-3">
                        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{permission.title}</div>
                          <div className="mt-1 text-[13px] leading-snug text-muted-foreground">{permission.description}</div>
                        </div>
                      </div>
                    </td>
                    {RIGHTS_ROLES.map((role) => (
                      <td key={role} className="px-3 py-4 text-center align-top">
                        <Checkbox
                          aria-label={role}
                          checked={grants[permission.id]?.[role] ?? false}
                          onCheckedChange={() => setGrants((current) => togglePermission(current, permission.id, role))}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </PageBody>
      </PageCard>
    </PageContainer>
  );
}
