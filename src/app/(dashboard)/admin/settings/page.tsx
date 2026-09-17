import type { Metadata } from "next";
import { AppSettingsManager } from "@/components/admin/settings/app-settings-manager";

export const metadata: Metadata = {
  title: "App Settings",
};

export default function AdminSettingsPage() {
  return <AppSettingsManager />;
}
