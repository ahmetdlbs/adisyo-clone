"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DEMO_IDENTITY } from "@/config/demo-identity";
import { NAVIGATION, isNavGroup, visibleNavigation, type NavGroup, type NavLink } from "@/config/navigation";
import { useActiveApps } from "@/features/entitlements/components/active-apps-provider";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { cn } from "@/lib/utils";
import { isRouteActive } from "./nav-utils";

interface NavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavDrawer({ open, onOpenChange }: NavDrawerProps) {
  const pathname = usePathname();
  const { logout, isPending: isLoggingOut } = useLogout();
  const close = () => onOpenChange(false);
  const navigation = visibleNavigation(NAVIGATION, useActiveApps());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 max-w-[85vw] gap-0 p-0 sm:max-w-72">
        <SheetHeader className="flex-row items-center gap-2 border-b p-4">
          <BrandLogo size="sm" />
          <span className="text-[11px] text-muted-foreground">3.0</span>
          <SheetTitle className="sr-only">Menü</SheetTitle>
        </SheetHeader>

        <div className="border-b bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground">
          {DEMO_IDENTITY.name.toUpperCase()} - {DEMO_IDENTITY.restaurantId}
        </div>

        <nav aria-label="Ana menü" className="flex-1 space-y-1 overflow-y-auto p-2">
          {navigation.map((entry) =>
            isNavGroup(entry) ? (
              <NavGroupSection key={entry.label} group={entry} pathname={pathname} onNavigate={close} />
            ) : (
              <NavLinkItem key={entry.label} link={entry} pathname={pathname} onNavigate={close} />
            )
          )}
        </nav>

        <SheetFooter className="border-t p-3">
          <Button variant="destructive" size="lg" className="w-full" disabled={isLoggingOut} onClick={logout}>
            <LogOut />
            Çıkış Yap
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface NavItemProps {
  pathname: string;
  onNavigate: () => void;
}

function NavGroupSection({ group, pathname, onNavigate }: NavItemProps & { group: NavGroup }) {
  const containsActivePage = group.children.some((child) => child.href && isRouteActive(pathname, child.href));
  // The panel unmounts with the sheet, so this initial value re-runs on every open.
  const [expanded, setExpanded] = useState(containsActivePage);
  const Icon = group.icon;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger
        render={<Button variant="ghost" size="xl" className="w-full justify-between px-3 text-sm font-medium" />}
      >
        <span className="flex items-center gap-3">
          <Icon className="size-5 text-muted-foreground" />
          {group.label}
        </span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-0.5 py-1 pl-8">
          {group.children.map((child) => (
            <NavLinkItem key={child.label} link={child} pathname={pathname} onNavigate={onNavigate} nested />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkItem({ link, pathname, onNavigate, nested = false }: NavItemProps & { link: NavLink; nested?: boolean }) {
  const Icon = link.icon;
  const size = nested ? "lg" : "xl";
  const className = cn("w-full justify-start gap-3 px-3 text-sm font-medium", nested && "text-[13px]");

  const content = (
    <>
      {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
      <span className="flex-1 truncate text-left">{link.label}</span>
      {link.badge && <Badge>{link.badge}</Badge>}
    </>
  );

  if (!link.href) {
    return (
      <Button variant="ghost" size={size} disabled className={className}>
        {content}
      </Button>
    );
  }

  const isActive = isRouteActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        className,
        isActive && "bg-accent font-semibold text-accent-foreground"
      )}
    >
      {content}
    </Link>
  );
}
