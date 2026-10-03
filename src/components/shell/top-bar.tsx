"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { useRouter } from "next/navigation";
import { CreditCard, Headphones, LogOut, Megaphone, Menu, RotateCw, Settings, User, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DEMO_IDENTITY } from "@/config/demo-identity";
import { ROUTES } from "@/config/routes";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { notifyUnavailable } from "@/lib/notify";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 shadow-(--shadow-card) select-none">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-lg" aria-label="Menüyü aç" onClick={onMenuClick}>
          <Menu />
        </Button>
        <BrandLogo size="sm" />
        <span className="hidden border-l pl-3 text-sm font-medium text-muted-foreground md:inline">{DEMO_IDENTITY.name}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* router.refresh() re-fetches server data and keeps client state; a full reload would wipe open orders. */}
        <IconAction label="Sayfayı yenile" onClick={() => router.refresh()}>
          <RotateCw />
        </IconAction>

        <IconAction label="Duyurular" onClick={notifyUnavailable}>
          <Megaphone />
        </IconAction>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
          onClick={notifyUnavailable}
        >
          <Headphones />
          Destek İste
        </Button>

        <AccountMenu />
      </div>
    </header>
  );
}

function IconAction({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  onClick: ComponentProps<typeof Button>["onClick"];
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="ghost" size="icon" aria-label={label} onClick={onClick} className={className} />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function AccountMenu() {
  const { logout, isPending: isLoggingOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" size="sm" className="rounded-full" />}>
        <User />
        {DEMO_IDENTITY.restaurantId} - {DEMO_IDENTITY.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem render={<Link href={ROUTES.profile} />}>
          <User />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={ROUTES.restaurantSettings} />}>
          <Settings />
          Restaurant Ayarları
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={ROUTES.account} />}>
          <CreditCard />
          Hesap Bilgileri
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={notifyUnavailable}>
          <Wand2 />
          Hızlı Başlangıç Rehberi
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onClick={logout}>
          <LogOut />
          Çıkış
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
