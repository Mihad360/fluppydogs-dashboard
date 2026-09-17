"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { BrandMark } from "@/components/admin/brand-mark";
import { useDashboardUi } from "@/context/dashboard-ui-context";
import { useAppMessage } from "@/hooks/useAppMessage";
import { handleLogout } from "@/lib/auth/auth.handlers";
import { getAdminNavItem } from "@/lib/admin/nav";
import { PUNKIES_LOGO } from "@/lib/admin/mock-data";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";

export function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const message = useAppMessage();
  const { isMobile, isTablet, showMobileSidebar, openSidebar } = useDashboardUi();
  const current = getAdminNavItem(pathname);
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  const onLogout = () => {
    handleLogout();
    message.success("Logged out");
    router.replace("/login");
  };

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur-md"
      style={{
        borderBottom: `1.5px solid ${PP.borderSoft}`,
        boxShadow: "0 2px 12px rgba(168,85,247,0.06)",
        padding: isMobile ? "12px 16px" : isTablet ? "14px 24px" : "16px 32px",
      }}
    >
      <div className="flex items-center gap-3">
        {showMobileSidebar && (
          <button
            type="button"
            onClick={openSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors"
            style={{
              background: PP.borderSoft,
              border: `1.5px solid ${PP.border}`,
              color: PP.hamburger,
              flexShrink: 0,
            }}
            aria-label="Open navigation menu"
          >
            <MenuOutlined style={{ fontSize: 18 }} />
          </button>
        )}
        <div className="min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-0"
            style={{ color: PP.muted, fontFamily: F_BODY }}
          >
            {current.icon} {current.label}
          </p>
          {!isMobile && (
            <p
              className="font-bold mb-0"
              style={{ fontFamily: F_HEAD, color: PP.ink, fontSize: 18 }}
            >
              Punkies Playhouse Admin
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {!isMobile && todayLabel && (
          <span
            className="text-xs font-medium px-3 py-1.5 rounded-xl"
            style={{
              background: PP.borderSoft,
              color: PP.hamburger,
              fontFamily: F_BODY,
            }}
          >
            {todayLabel}
          </span>
        )}
        <Popconfirm
          title="Log out of admin?"
          onConfirm={onLogout}
          okText="Log out"
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            aria-label="Log out"
            style={{ color: PP.hamburger }}
          >
            {!isMobile ? "Logout" : null}
          </Button>
        </Popconfirm>
        <div
          className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
          style={{ border: `2px solid ${PP.border}` }}
        >
          <BrandMark
            src={PUNKIES_LOGO}
            alt="Admin"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
