"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { DashboardUiProvider, useDashboardUi } from "@/context/dashboard-ui-context";
import { F_BODY, PP } from "@/lib/admin/theme";

function DashboardShellInner({ children }: { children: ReactNode }) {
  const { isMobile, isTablet } = useDashboardUi();

  return (
    <div
      className="dashboard-shell flex h-screen overflow-hidden"
      style={{ fontFamily: F_BODY, background: PP.bg }}
    >
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E9D5FF transparent" }}
      >
        <DashboardNavbar />
        <div
          style={{
            padding: isMobile ? "20px 16px" : isTablet ? "24px 24px" : "28px 32px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <DashboardUiProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardUiProvider>
  );
}
