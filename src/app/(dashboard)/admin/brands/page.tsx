import type { Metadata } from "next";
import { BrandsManager } from "@/components/admin/brands/brands-manager";

export const metadata: Metadata = {
  title: "Brands/Items",
};

export default function AdminBrandsPage() {
  return <BrandsManager />;
}
