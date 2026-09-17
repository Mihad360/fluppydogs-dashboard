import { baseApi } from "./baseApi";
import type { ApiListResponse } from "@/types/api";

export type ApiGame = {
  _id: string;
  name: string;
  url: string;
  emoji?: string;
  thumbnail?: { path: string; url: string } | null;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
};

export const gamesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query<
      ApiListResponse<ApiGame[]>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/games",
        method: "GET",
        params: params || { limit: 100, sort: "sortOrder" },
      }),
      providesTags: ["games"],
    }),

    createGame: build.mutation<ApiListResponse<ApiGame>, FormData>({
      query: (data) => ({
        url: "/games/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["games", "dashboard"],
    }),

    updateGame: build.mutation<
      ApiListResponse<ApiGame>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/games/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["games", "dashboard"],
    }),

    deleteGame: build.mutation<ApiListResponse<ApiGame>, string>({
      query: (id) => ({
        url: `/games/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["games", "dashboard"],
    }),
  }),
});

export const {
  useGetGamesQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} = gamesApi;
