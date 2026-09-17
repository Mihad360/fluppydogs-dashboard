import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminDataProvider } from "@/context/admin-data-context";

export const metadata: Metadata = {
  title: {
    default: "Punkies Playhouse Admin",
    template: "%s · Punkies Playhouse",
  },
  description: "Admin panel for Punkies Playhouse Alerts",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AdminDataProvider>
      <DashboardShell>{children}</DashboardShell>
    </AdminDataProvider>
  );
}
