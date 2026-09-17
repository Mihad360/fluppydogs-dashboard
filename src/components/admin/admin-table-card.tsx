"use client";

import { Card } from "antd";
import type { ReactNode } from "react";
import { PP } from "@/lib/admin/theme";

export function AdminTableCard({ children }: { children: ReactNode }) {
  return (
    <Card
      variant="borderless"
      style={{ borderRadius: 16, border: `1.5px solid ${PP.border}` }}
      styles={{ body: { padding: 0 } }}
    >
      <div className="admin-table-scroll">{children}</div>
    </Card>
  );
}
