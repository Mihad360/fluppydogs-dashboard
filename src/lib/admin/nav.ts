import type { AdminNavItem } from "@/types/admin";

export const ADMIN_NAV: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", href: "/admin" },
  { id: "posts", label: "Updates & Posts", icon: "📣", href: "/admin/posts" },
  { id: "brands", label: "Brands/Items", icon: "🏷️", href: "/admin/brands" },
  {
    id: "messages",
    label: "Submissions",
    icon: "📬",
    href: "/admin/submissions",
  },
  { id: "games", label: "Mini Games", icon: "🎮", href: "/admin/games" },
  { id: "settings", label: "App Settings", icon: "⚙️", href: "/admin/settings" },
];

export function isAdminNavActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminNavItem(pathname: string) {
  return (
    ADMIN_NAV.find((item) => isAdminNavActive(pathname, item.href)) ??
    ADMIN_NAV[0]
  );
}
