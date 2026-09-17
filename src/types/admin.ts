export type AdminNavId =
  | "dashboard"
  | "posts"
  | "brands"
  | "messages"
  | "games"
  | "settings";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  accent: string;
  accent2: string;
  bgTint: string;
  description?: string;
}

export interface Post {
  id: string;
  brandId: string;
  title: string;
  body: string;
  date: string;
  published: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  unread: boolean;
  color: string;
}

export interface Game {
  id: string;
  name: string;
  emoji: string;
  url: string;
}

export interface AppCopy {
  privacy: string;
  terms: string;
  about: string;
}

export interface AdminNavItem {
  id: AdminNavId;
  label: string;
  icon: string;
  href: string;
}
