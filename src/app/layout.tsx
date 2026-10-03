import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Pages set only their own name ("KDV Oranları"); the template adds the product.
  title: { default: "Adisyon Merkezi", template: "%s | Adisyon Merkezi" },
  robots: { index: false, follow: false },
  other: { google: "notranslate" },
  applicationName: "Adisyon Merkezi",
  description: "Restoran ve kafeler için adisyon, sipariş, stok ve işletme yönetimi.",
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
