"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_BRAND_LOGO,
  INIT_APP_COPY,
  INIT_BRANDS,
  INIT_GAMES,
  INIT_POSTS,
  INIT_SUBMISSIONS,
  formatAdminDate,
} from "@/lib/admin/mock-data";
import type { AppCopy, Brand, ContactSubmission, Game, Post } from "@/types/admin";

interface AdminDataContextValue {
  brands: Brand[];
  posts: Post[];
  submissions: ContactSubmission[];
  games: Game[];
  appCopy: AppCopy;
  forwardEmail: string;
  unreadCount: number;
  getBrand: (id: string) => Brand;
  addPost: (input: Pick<Post, "brandId" | "title" | "body">) => void;
  updatePost: (id: string, input: Pick<Post, "brandId" | "title" | "body">) => void;
  deletePost: (id: string) => void;
  addBrand: (input: Pick<Brand, "name" | "accent"> & { description?: string }) => void;
  updateBrand: (
    id: string,
    input: Pick<Brand, "name" | "accent"> & { description?: string },
  ) => void;
  deleteBrand: (id: string) => void;
  addGame: (input: Pick<Game, "name" | "url" | "emoji">) => void;
  updateGame: (id: string, input: Pick<Game, "name" | "url" | "emoji">) => void;
  deleteGame: (id: string) => void;
  markSubmission: (id: string, readState: boolean) => void;
  saveAppCopy: (copy: AppCopy) => void;
  saveForwardEmail: (email: string) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

const FALLBACK_BRAND: Brand = {
  id: "unknown",
  name: "Unknown",
  logo: DEFAULT_BRAND_LOGO,
  accent: "#A855F7",
  accent2: "#FF6B9D",
  bgTint: "#FAF0FF",
};

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(INIT_BRANDS);
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(INIT_SUBMISSIONS);
  const [games, setGames] = useState<Game[]>(INIT_GAMES);
  const [appCopy, setAppCopy] = useState<AppCopy>(INIT_APP_COPY);
  const [forwardEmail, setForwardEmail] = useState("admin@punkiesplayhouse.com");

  const unreadCount = submissions.filter((item) => item.unread).length;

  const getBrand = useCallback(
    (id: string) => brands.find((brand) => brand.id === id) ?? FALLBACK_BRAND,
    [brands],
  );

  const addPost = useCallback((input: Pick<Post, "brandId" | "title" | "body">) => {
    setPosts((current) => [
      {
        id: `p${Date.now()}`,
        ...input,
        date: formatAdminDate(),
        published: true,
      },
      ...current,
    ]);
  }, []);

  const updatePost = useCallback(
    (id: string, input: Pick<Post, "brandId" | "title" | "body">) => {
      setPosts((current) =>
        current.map((post) =>
          post.id === id ? { ...post, ...input, published: true } : post,
        ),
      );
    },
    [],
  );

  const deletePost = useCallback((id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  const addBrand = useCallback(
    (input: Pick<Brand, "name" | "accent"> & { description?: string }) => {
      setBrands((current) => [
        ...current,
        {
          id: `brand-${Date.now()}`,
          name: input.name,
          logo: DEFAULT_BRAND_LOGO,
          accent: input.accent || "#A855F7",
          accent2: "#FF6B9D",
          bgTint: "#FAF0FF",
          description: input.description,
        },
      ]);
    },
    [],
  );

  const updateBrand = useCallback(
    (
      id: string,
      input: Pick<Brand, "name" | "accent"> & { description?: string },
    ) => {
      setBrands((current) =>
        current.map((brand) =>
          brand.id === id
            ? {
                ...brand,
                name: input.name,
                accent: input.accent || brand.accent,
                description: input.description,
              }
            : brand,
        ),
      );
    },
    [],
  );

  const deleteBrand = useCallback((id: string) => {
    setBrands((current) => current.filter((brand) => brand.id !== id));
  }, []);

  const addGame = useCallback((input: Pick<Game, "name" | "url" | "emoji">) => {
    setGames((current) => [...current, { id: `g${Date.now()}`, ...input }]);
  }, []);

  const updateGame = useCallback(
    (id: string, input: Pick<Game, "name" | "url" | "emoji">) => {
      setGames((current) =>
        current.map((game) => (game.id === id ? { ...game, ...input } : game)),
      );
    },
    [],
  );

  const deleteGame = useCallback((id: string) => {
    setGames((current) => current.filter((game) => game.id !== id));
  }, []);

  const markSubmission = useCallback((id: string, readState: boolean) => {
    setSubmissions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: !readState } : item,
      ),
    );
  }, []);

  const saveAppCopy = useCallback((copy: AppCopy) => {
    setAppCopy(copy);
  }, []);

  const saveForwardEmail = useCallback((email: string) => {
    setForwardEmail(email);
  }, []);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      brands,
      posts,
      submissions,
      games,
      appCopy,
      forwardEmail,
      unreadCount,
      getBrand,
      addPost,
      updatePost,
      deletePost,
      addBrand,
      updateBrand,
      deleteBrand,
      addGame,
      updateGame,
      deleteGame,
      markSubmission,
      saveAppCopy,
      saveForwardEmail,
    }),
    [
      brands,
      posts,
      submissions,
      games,
      appCopy,
      forwardEmail,
      unreadCount,
      getBrand,
      addPost,
      updatePost,
      deletePost,
      addBrand,
      updateBrand,
      deleteBrand,
      addGame,
      updateGame,
      deleteGame,
      markSubmission,
      saveAppCopy,
      saveForwardEmail,
    ],
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
}
