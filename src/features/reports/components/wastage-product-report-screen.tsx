import { CheckCircle2, TriangleAlert } from "lucide-react";
import { PageContainer } from "@/components/kit/page";

/** A module upsell page in the original app: explains a feature that is not enabled, rather than showing data. */
export function WastageProductReportScreen() {
  return (
    <PageContainer className="max-w-3xl gap-8">
      <section>
        <div className="mb-4 flex items-center gap-3">
          <TriangleAlert aria-hidden="true" className="text-warning" />
          <h1 className="text-base font-bold text-foreground">Fire Tanımı Nedir?</h1>
        </div>
        <p className="ml-9 text-[15px] leading-relaxed text-foreground">
          Bu ekran, seçili hammadde ürünleriniz için fire miktarını takip edebilmenizi sağlar. Ürün bazında beklenen ve kabul edilebilir fire
          oranlarını girerek, gün sonunda gerçekleşen fire miktarlarını analiz edebilirsiniz. Fire takibi, hammadde israfını azaltarak maliyet
          kontrolü sağlamanıza yardımcı olur.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <CheckCircle2 aria-hidden="true" className="text-success" />
          <h2 className="text-base font-bold text-foreground">Nasıl Aktif Edilir?</h2>
        </div>
        <div className="ml-9 flex flex-col gap-6 text-[15px] leading-relaxed text-foreground">
          <p>
            Fire modülü ile ilgili ücretlendirme ve detaylı bilgi için{" "}
            <a href="mailto:info@adisyonmerkezi.com" className="text-primary hover:underline">
              info@adisyonmerkezi.com
            </a>{" "}
            adresine yazabilir veya{" "}
            <a href="tel:02167060624" className="text-primary hover:underline">
              0216 706 06 24
            </a>{" "}
            numaralı satış hattımızdan bizimle iletişime geçebilirsiniz.
          </p>
          <p>
            Fire yüzdesinin hesaplanabilmesi için, gün başı ve gün sonu işlemleri sırasında ilgili ürünlerin çiğ ve pişmiş miktarlarını girmeniz
            gerekmektedir.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
