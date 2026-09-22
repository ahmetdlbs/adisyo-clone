"use client";

import { Headset, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SUPPORT_PHONE_LABEL = "+90 (216) 706 06 24";
const SUPPORT_PHONE_HREF = "tel:+902167060624";
const REMOTE_SUPPORT_DOWNLOAD_URL = "https://alpemix.com/site/Alpemix.exe";

/** Help entry on the auth screens: call support or start a remote session. */
export function SupportMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full text-primary" />}>
        <Headset />
        Destek İste
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem render={<a href={SUPPORT_PHONE_HREF} />}>
          <Headset />
          {SUPPORT_PHONE_LABEL}
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href={REMOTE_SUPPORT_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" />}>
          <MonitorSmartphone />
          Uzak Bağlantı
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
