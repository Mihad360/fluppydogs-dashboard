"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface DashboardUiContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showMobileSidebar: boolean;
}

const DashboardUiContext = createContext<DashboardUiContextValue | null>(null);

export function DashboardUiProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const showMobileSidebar = !isDesktop;

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!showMobileSidebar) setSidebarOpen(false);
  }, [showMobileSidebar]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [sidebarOpen]);

  useEffect(() => {
    if (showMobileSidebar && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileSidebar, sidebarOpen]);

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      openSidebar,
      closeSidebar,
      isMobile,
      isTablet,
      isDesktop,
      showMobileSidebar,
    }),
    [
      sidebarOpen,
      openSidebar,
      closeSidebar,
      isMobile,
      isTablet,
      isDesktop,
      showMobileSidebar,
    ],
  );

  return (
    <DashboardUiContext.Provider value={value}>
      {children}
    </DashboardUiContext.Provider>
  );
}

export function useDashboardUi() {
  const context = useContext(DashboardUiContext);
  if (!context) {
    throw new Error("useDashboardUi must be used within DashboardUiProvider");
  }
  return context;
}
