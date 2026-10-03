import type { Metadata } from "next";
import type { CourseGroup } from "@/features/catalog/model/course-group";
import type { KitchenGroup } from "@/features/catalog/model/kitchen-group";
import type { Unit } from "@/features/catalog/model/unit";
import type { VatDefinition } from "@/features/catalog/model/vat";
import { fetchFeatureGroups } from "@/features/catalog/server/feature-group-actions";
import { ProductDetailScreen } from "@/features/pos/components/product-detail-screen";
import { fetchStockItems } from "@/features/stock/server/actions";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Ürün Detay" };

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vatDefinitions, kitchenGroups, courseGroups, units, featureGroups, stockItems] = await Promise.all([
    apiFetch<VatDefinition[]>("/vat-definitions"),
    apiFetch<KitchenGroup[]>("/kitchen-groups"),
    apiFetch<CourseGroup[]>("/course-groups"),
    apiFetch<Unit[]>("/units"),
    fetchFeatureGroups(),
    fetchStockItems(),
  ]);

  return (
    <ProductDetailScreen
      productId={id}
      vatDefinitions={vatDefinitions}
      kitchenGroups={kitchenGroups}
      courseGroups={courseGroups}
      units={units}
      featureGroups={featureGroups}
      stockItems={stockItems}
    />
  );
}
