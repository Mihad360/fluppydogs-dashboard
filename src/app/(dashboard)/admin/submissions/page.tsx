import type { Metadata } from "next";
import { SubmissionsManager } from "@/components/admin/submissions/submissions-manager";

export const metadata: Metadata = {
  title: "Submissions",
};

export default function AdminSubmissionsPage() {
  return <SubmissionsManager />;
}
