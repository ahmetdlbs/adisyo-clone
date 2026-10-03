"use client";

import { Award, CheckCircle2, Gift, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ReferralStats {
  clicks: number;
  signups: number;
  /** Free months earned so far. */
  rewardMonths: number;
}

interface ReferralScreenProps {
  /** The account's own referral code, e.g. from `DEMO_IDENTITY`. */
  referralCode: string;
  stats?: ReferralStats;
  /** Defaults to the browser clipboard; injectable so tests never depend on a real Clipboard API. */
  copyToClipboard?: (text: string) => Promise<void>;
}

const defaultCopyToClipboard = (text: string) => navigator.clipboard.writeText(text);

const STEPS = [
  { title: "Bağlantıyı Paylaşın", description: "Referans linkinizi çevrenizdeki diğer restoran veya kafelerle paylaşın." },
  { title: "Kayıt Olsunlar", description: "Paylaştığınız link üzerinden sisteme kayıt olup kullanıma başlasınlar." },
  { title: "Ödülünüzü Kazanın", description: "Referansınızla gelen her aktif müşteri için hesabınıza ödülünüz tanımlansın." },
] as const;

const DEFAULT_STATS: ReferralStats = { clicks: 0, signups: 0, rewardMonths: 0 };

export function ReferralScreen({ referralCode, stats = DEFAULT_STATS, copyToClipboard = defaultCopyToClipboard }: ReferralScreenProps) {
  const referralLink = `https://adisyonmerkezi.com/tr/kayit?ref=${referralCode}`;

  const copyLink = async () => {
    try {
      await copyToClipboard(referralLink);
      toast.success("Bağlantı kopyalandı");
    } catch {
      toast.error("Bağlantı kopyalanamadı");
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground shadow-sm">
        <div aria-hidden="true" className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
          <Gift className="size-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Tavsiye Et ve Kazan!</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-primary-foreground/90">
          Adisyon Merkezi&apos;ni çevrenizdeki işletmelere tavsiye edin, onların da işlerini kolaylaştırmasını sağlayın. Sizin referansınızla kayıt olan her
          yeni işletme için ekstra kullanım süresi ve sürpriz ödüller kazanın!
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <section className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Share2 aria-hidden="true" className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Referans Bağlantınız</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Aşağıdaki bağlantıyı kopyalayarak WhatsApp, e-posta veya sosyal medya üzerinden paylaşabilirsiniz.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 rounded-md border bg-muted/50 px-4 py-3">
                <span className="text-[15px] font-medium text-foreground select-all">{referralLink}</span>
              </div>
              <Button onClick={copyLink}>Bağlantıyı Kopyala</Button>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Nasıl Çalışır?</h2>
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex flex-col items-center text-center">
                  <span
                    aria-hidden="true"
                    className={`mb-4 flex size-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
                      index === STEPS.length - 1 ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-primary"
                    }`}
                  >
                    {index === STEPS.length - 1 ? <CheckCircle2 /> : index + 1}
                  </span>
                  <h3 className="mb-2 text-[15px] font-semibold text-foreground">{step.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="w-full shrink-0 rounded-lg border bg-card shadow-sm lg:w-80">
          <div className="flex items-center gap-2 border-b p-5">
            <Award aria-hidden="true" className="text-warning" />
            <h2 className="text-base font-semibold text-foreground">İstatistikleriniz</h2>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <StatRow icon={Share2} label="Toplam Tıklama" value={stats.clicks} />
            <StatRow icon={Users} label="Kayıt Olanlar" value={stats.signups} />
            <StatRow icon={Gift} label="Kazanılan Ödül" value={`${stats.rewardMonths} Ay`} tone="primary" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, tone = "muted" }: { icon: typeof Share2; label: string; value: string | number; tone?: "muted" | "primary" }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${tone === "primary" ? "border-primary/20 bg-primary/5" : "bg-muted/30"}`}>
      <div>
        <p className="mb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{label}</p>
        <p className={`text-2xl font-bold ${tone === "primary" ? "text-primary" : "text-foreground"}`}>{value}</p>
      </div>
      <div aria-hidden="true" className={`flex size-10 items-center justify-center rounded-full ${tone === "primary" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="size-5" />
      </div>
    </div>
  );
}
