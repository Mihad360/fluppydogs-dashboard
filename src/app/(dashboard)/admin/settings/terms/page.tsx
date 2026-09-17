import type { Metadata } from "next";
import { LegalDocEditor } from "@/components/admin/settings/legal-doc-editor";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsSettingsPage() {
  return <LegalDocEditor type="terms" />;
}
