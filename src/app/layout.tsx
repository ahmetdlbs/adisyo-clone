import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "material-icons/iconfont/material-icons.css";
import "./globals.css";
import { PosProvider } from "@/context/PosContext";
import { ShellProvider } from "@/components/shell/ShellContext";

const quicksand = Quicksand({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Adisyo",
  robots: { index: false, follow: false },
  other: { google: "notranslate" },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#c92c2c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={quicksand.variable}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <PosProvider>
          <ShellProvider>
            {children}
          </ShellProvider>
        </PosProvider>
      </body>
    </html>
  );
}
