import { baseApi } from "./baseApi";
import type { ApiListResponse, ApiPost } from "@/types/api";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<
      ApiListResponse<ApiPost[]>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/posts",
        method: "GET",
        params: params || { limit: 50, sort: "-createdAt" },
      }),
      providesTags: ["posts"],
    }),

    createPost: build.mutation<ApiListResponse<ApiPost>, FormData>({
      query: (data) => ({
        url: "/posts/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["posts", "dashboard"],
    }),

    updatePost: build.mutation<
      ApiListResponse<ApiPost>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["posts", "dashboard"],
    }),

    deletePost: build.mutation<ApiListResponse<ApiPost>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["posts", "dashboard"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
