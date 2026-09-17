import type { Metadata } from "next";
import { GamesManager } from "@/components/admin/games/games-manager";

export const metadata: Metadata = {
  title: "Mini Games",
};

export default function AdminGamesPage() {
  return <GamesManager />;
}
