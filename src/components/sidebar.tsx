"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseOutlined } from "@ant-design/icons";
import { BrandMark } from "@/components/admin/brand-mark";
import { useDashboardUi } from "@/context/dashboard-ui-context";
import { ADMIN_NAV, isAdminNavActive } from "@/lib/admin/nav";
import { PUNKIES_LOGO } from "@/lib/admin/mock-data";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";
import { useGetOverviewQuery } from "@/redux/api/dashboardApi";
import { useGetSubmissionsUnreadCountQuery } from "@/redux/api/submissionsApi";

function SidebarContent() {
  const pathname = usePathname();
  const { data } = useGetOverviewQuery();
  const { data: unreadData } = useGetSubmissionsUnreadCountQuery();
  const unreadCount =
    unreadData?.data?.count ?? data?.data?.stats?.unreadSubmissions ?? 0;
  const { showMobileSidebar, closeSidebar } = useDashboardUi();

  return (
    <>
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <BrandMark
          src={PUNKIES_LOGO}
          alt="Punkies Playhouse"
          className="w-12 h-12 rounded-xl flex-shrink-0"
          imgClassName="w-full h-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p
            className="leading-normal text-white mb-0"
            style={{ fontFamily: F_HEAD, fontSize: 18 }}
          >
            Punkies Playhouse
          </p>
        </div>
        {showMobileSidebar && (
          <button
            type="button"
            onClick={closeSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            style={{ border: "none", background: "transparent" }}
            aria-label="Close sidebar"
          >
            <CloseOutlined style={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      <nav
        className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {ADMIN_NAV.map((item) => {
          const active = isAdminNavActive(pathname, item.href);
          const hasBadge = item.id === "messages" && unreadCount > 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (showMobileSidebar) closeSidebar();
              }}
              data-active={active}
              className="admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all no-underline"
            >
              <span className="text-lg w-7 text-center">{item.icon}</span>
              <span
                className="flex-1 text-sm font-semibold"
                style={{ fontFamily: F_BODY }}
              >
                {item.label}
              </span>
              {hasBadge && (
                <span
                  className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: PP.pink }}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p
          className="text-[10px] font-medium mb-0"
          style={{ color: PP.sidebarFooter, fontFamily: F_BODY, lineHeight: 1.5 }}
        >
          Admin Panel v1.0
          <br />
          Punkies Playhouse Alerts
        </p>
      </div>
    </>
  );
}

export function Sidebar() {
  const { showMobileSidebar, sidebarOpen, closeSidebar, isMobile } =
    useDashboardUi();

  if (!showMobileSidebar) {
    return (
      <aside
        className="w-72 flex-shrink-0 flex flex-col"
        style={{ background: PP.sidebar, height: "100vh" }}
      >
        <SidebarContent />
      </aside>
    );
  }

  return (
    <>
      <div
        className="admin-sidebar-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={closeSidebar}
      />
      <aside
        className="flex flex-col"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: isMobile ? "85vw" : "320px",
          maxWidth: "320px",
          zIndex: 50,
          background: PP.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: sidebarOpen ? "4px 0 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
