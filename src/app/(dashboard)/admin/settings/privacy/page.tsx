import type { Metadata } from "next";
import { LegalDocEditor } from "@/components/admin/settings/legal-doc-editor";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacySettingsPage() {
  return <LegalDocEditor type="privacy" />;
}
