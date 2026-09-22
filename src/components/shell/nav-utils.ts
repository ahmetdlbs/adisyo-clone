import { isNavGroup, type NavEntry, type NavGroup } from "@/config/navigation";

/** True for the href itself and any page nested below it (`/kitchen-detail/98012` -> `/kitchen-detail`). */
export function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The group whose child matches `pathname`, so the drawer can open it by default. */
export function findActiveGroup(pathname: string, navigation: readonly NavEntry[]): NavGroup | undefined {
  return navigation
    .filter(isNavGroup)
    .find((group) => group.children.some((child) => child.href && isRouteActive(pathname, child.href)));
}
