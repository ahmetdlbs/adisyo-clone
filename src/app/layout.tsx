import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Adisyo - Bulut Tabanlı Restoran POS Sistemi",
  description: "Restoran, kafe, bar ve paket servis işletmeleri için bulut tabanlı yeni nesil adisyon ve POS yönetim sistemi.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={quicksand.variable}>
      <body className="font-sans antialiased bg-[#f8f9fa] text-[#2b2f36] min-h-screen overflow-x-hidden selection:bg-[#c92c2c] selection:text-white">
        {children}
      </body>
    </html>
  );
}
