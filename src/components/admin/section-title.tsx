"use client";

import { Typography } from "antd";
import { F_HEAD, PP } from "@/lib/admin/theme";
import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography.Title
      level={3}
      style={{ fontFamily: F_HEAD, color: PP.ink, marginBottom: 20 }}
    >
      {children}
    </Typography.Title>
  );
}
