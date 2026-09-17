"use client";

import { App, ConfigProvider } from "antd";
import { antdTheme } from "@/lib/admin/theme";
import type { ReactNode } from "react";

export function AntdThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
