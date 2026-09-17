import type { Metadata } from "next";
import { PostsManager } from "@/components/admin/posts/posts-manager";

export const metadata: Metadata = {
  title: "Updates & Posts",
};

export default function AdminPostsPage() {
  return <PostsManager />;
}
