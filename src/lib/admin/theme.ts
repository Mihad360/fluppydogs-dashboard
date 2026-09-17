import type { CSSProperties } from "react";
import type { ThemeConfig } from "antd";

export const F_HEAD = "'Fredoka One', var(--font-fredoka), cursive";
export const F_BODY = "var(--font-inter), 'Inter', sans-serif";

export const PP = {
  bg: "#FAF7FF",
  sidebar: "#1A1030",
  pink: "#FF3D8A",
  purple: "#A855F7",
  muted: "#9D6FBB",
  navIdle: "#9D8FC0",
  border: "#E9D5FF",
  borderSoft: "#F3E8FF",
  ink: "#1a1a1a",
  gray: "#9CA3AF",
  green: "#10B981",
  headingPurple: "#6D28D9",
  hamburger: "#7B2FBE",
  sidebarFooter: "#4B3F6A",
  cardShadow: "0 2px 16px rgba(168,85,247,0.08)",
} as const;

export const GRADIENT = "linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)";
export const GRADIENT_SOFT =
  "linear-gradient(135deg, rgba(255,61,138,0.2) 0%, rgba(168,85,247,0.2) 100%)";

export const gradientButtonStyle: CSSProperties = {
  background: GRADIENT,
  border: "none",
};

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: PP.purple,
    colorInfo: PP.purple,
    borderRadius: 12,
    fontFamily: F_BODY,
  },
  components: {
    Button: {
      borderRadius: 12,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Card: {
      borderRadiusLG: 16,
    },
    Input: {
      activeBorderColor: PP.purple,
      hoverBorderColor: "#c084fc",
    },
    Select: {
      activeBorderColor: PP.purple,
      hoverBorderColor: "#c084fc",
    },
    Table: {
      headerBg: "#FBF7FF",
      rowHoverBg: "#FAF0FF",
    },
  },
};
