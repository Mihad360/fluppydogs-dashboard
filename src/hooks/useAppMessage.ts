"use client";

import { App } from "antd";

/** Use Ant Design message inside <App> so theme context works. */
export function useAppMessage() {
  const { message } = App.useApp();
  return message;
}
