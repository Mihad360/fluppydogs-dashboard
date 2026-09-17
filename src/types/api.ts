export type ApiImage = {
  path: string;
  url: string;
} | null;

export type ApiBrand = {
  _id: string;
  name: string;
  logo?: ApiImage;
  accent: string;
  accent2?: string;
  bgTint: string;
  description?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiPost = {
  _id: string;
  brand: ApiBrand | string;
  title: string;
  shortDescription?: string | null;
  highlight?: string | null;
  body: string;
  banner?: ApiImage;
  thumbnail?: ApiImage;
  published: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiSubmission = {
  _id: string;
  name: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  isRead?: boolean;
  color?: string;
  createdAt?: string;
};

export type ApiOverview = {
  stats: {
    postsThisMonth: number;
    publishedPosts: number;
    unreadSubmissions: number;
    brandsCount: number;
    gamesCount: number;
    pushReadyDevices?: number;
  };
  latestPosts: ApiPost[];
  recentSubmissions: ApiSubmission[];
};

export type ApiListResponse<T> = {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
};
