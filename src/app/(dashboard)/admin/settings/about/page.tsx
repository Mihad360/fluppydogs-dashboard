import type { Metadata } from "next";
import { LegalDocEditor } from "@/components/admin/settings/legal-doc-editor";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutSettingsPage() {
  return <LegalDocEditor type="about" />;
}
