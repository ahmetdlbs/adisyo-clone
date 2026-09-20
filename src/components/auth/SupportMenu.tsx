"use client";

import { useEffect, useRef, useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";

const SUPPORT_PHONE_NUMBER = "+90 (216) 706 06 24";
const REMOTE_SUPPORT_DOWNLOAD_URL = "https://alpemix.com/site/Alpemix.exe";

const SUPPORT_ITEMS = [
  {
    id: "phone",
    icon: "support_agent",
    label: SUPPORT_PHONE_NUMBER,
    run: () => window.open(`tel:${SUPPORT_PHONE_NUMBER}`, "_self"),
  },
  {
    id: "remote",
    icon: "settings_remote",
    label: "Uzak Bağlantı",
    run: () => window.open(REMOTE_SUPPORT_DOWNLOAD_URL, "_blank", "noopener,noreferrer"),
  },
] as const;

export default function SupportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstItemRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-[38px] cursor-pointer items-center justify-center gap-[10px] rounded-[15px] border border-[#ececec] px-2 py-[6px] text-[rgba(0,0,0,0.87)]"
      >
        <MaterialIcon name="support_agent" className="text-fire-red-1" />
        <span>
          <span className="text-fire-red-1">Destek İste</span>
        </span>
      </button>

      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[1000]"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            className="absolute top-full right-0 z-[1001] w-[250px] origin-top-right animate-[menu-in_120ms_cubic-bezier(0,0,0.2,1)] overflow-hidden rounded-[4px] bg-white shadow-[0_5px_5px_-3px_rgba(0,0,0,0.2),0_8px_10px_1px_rgba(0,0,0,0.14),0_3px_14px_2px_rgba(0,0,0,0.12)]"
          >
            <div className="py-2">
              {SUPPORT_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  ref={index === 0 ? firstItemRef : undefined}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.run();
                    setIsOpen(false);
                  }}
                  className="flex h-12 w-full cursor-pointer items-center px-4 text-left text-[rgba(0,0,0,0.87)] outline-none hover:bg-black/[0.04] focus-visible:bg-black/[0.12]"
                >
                  <MaterialIcon name={item.icon} className="mr-4 text-[rgba(0,0,0,0.54)]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
