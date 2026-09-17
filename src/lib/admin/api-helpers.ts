import { DEFAULT_BRAND_LOGO } from "@/lib/admin/mock-data";
import type { ApiBrand, ApiPost } from "@/types/api";

export function getBrandLogoUrl(brand?: Pick<ApiBrand, "logo"> | null) {
  return brand?.logo?.url || DEFAULT_BRAND_LOGO;
}

export function getPostBrand(post: ApiPost): ApiBrand | null {
  if (post.brand && typeof post.brand === "object") {
    return post.brand;
  }
  return null;
}

export function getPostImageUrl(
  post?: Pick<ApiPost, "banner" | "thumbnail"> | null,
) {
  return post?.banner?.url || post?.thumbnail?.url || "";
}

export function formatApiDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function buildJsonFormData(
  payload: Record<string, unknown>,
  files?: Record<string, File | undefined>,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
  }

  return formData;
}
