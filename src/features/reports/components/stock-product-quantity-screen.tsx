import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { PageContainer } from "@/components/kit/page";
import { ROUTES } from "@/config/routes";

/** No product in this demo carries a stock quantity yet (see `product-definition-screen`), so this stays an honest empty state. */
export function StockProductQuantityScreen() {
  return (
    <PageContainer className="max-w-3xl">
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearch />
          </EmptyMedia>
          <h1 className="font-heading text-sm font-medium tracking-tight text-foreground">Ürünlerin stok durumu</h1>
          <EmptyDescription>
            Bu demoda stok takibi hiçbir üründe açık değil. Stok girişi yapabilmek için önce{" "}
            <Link href={ROUTES.productDefinition} className="font-medium text-primary hover:underline">
              Menü / Ürünler
            </Link>{" "}
            ekranından ilgili ürünlerde stok takibini açmanız gerekiyor.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
