import BrandLogo from "@/components/BrandLogo";
import type { ReactNode } from "react";
import { SupportMenu } from "./support-menu";
import { TestimonialPanel } from "./testimonial-panel";

interface AuthLayoutProps {
  children: ReactNode;
  /** Left-hand panel; the testimonial carousel unless a screen brings its own. */
  aside?: ReactNode;
}

/** Frame shared by the public auth screens: an aside on the left, brand header and the form on the right. */
export function AuthLayout({ children, aside = <TestimonialPanel /> }: AuthLayoutProps) {
  return (
    <div className="flex h-dvh">
      {aside}

      <div className="flex w-full flex-col items-center overflow-auto">
        <header className="flex w-full items-center justify-between px-[30px] py-[10px] max-[865px]:px-5">
          <a href="https://adisyonmerkezi.com" target="_blank" rel="noopener noreferrer" aria-label="Adisyon Merkezi" className="block max-w-full">
            <BrandLogo size="lg" />
          </a>
          <SupportMenu />
        </header>

        <div className="my-auto w-full max-w-[385px] px-5 py-8 text-left">{children}</div>
      </div>
    </div>
  );
}
