import Image from "next/image";
import type { ReactNode } from "react";
import SupportMenu from "./SupportMenu";
import TestimonialPanel from "./TestimonialPanel";

interface AuthTemplateProps {
  children: ReactNode;
}

/** Shared shell of the login / forgot-password screens: testimonial carousel on the left, form on the right. */
export default function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="flex h-screen">
      <TestimonialPanel />

      <div className="flex max-h-full w-full flex-col items-center overflow-auto">
        <header className="flex w-full items-center justify-between px-[30px] py-[10px] [@media(max-width:865px)]:px-5">
          <a
            href="https://adisyo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-full cursor-pointer"
          >
            <Image
              src="/images/login/logo-adisyo-yeni.svg"
              alt="Adisyo"
              width={154}
              height={45}
              unoptimized
              className="block h-auto max-w-full"
            />
          </a>
          <SupportMenu />
        </header>

        <div className="my-auto min-w-[385px] max-w-[385px] px-5 text-left [@media(max-width:380px)]:max-w-full [@media(max-width:380px)]:min-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
