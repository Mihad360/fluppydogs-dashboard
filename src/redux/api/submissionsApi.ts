import { baseApi } from "./baseApi";
import type { ApiListResponse, ApiSubmission } from "@/types/api";

export const submissionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubmissions: build.query<
      ApiListResponse<ApiSubmission[]>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/submissions",
        method: "GET",
        params: params || { limit: 50, sort: "-createdAt" },
      }),
      providesTags: ["submissions"],
    }),

    getSubmissionsUnreadCount: build.query<
      ApiListResponse<{ count: number }>,
      void
    >({
      query: () => ({
        url: "/submissions/unread-count",
        method: "GET",
      }),
      providesTags: ["submissions"],
    }),

    markSubmissionRead: build.mutation<ApiListResponse<ApiSubmission>, string>({
      query: (id) => ({
        url: `/submissions/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["submissions", "dashboard"],
    }),

    markSubmissionUnread: build.mutation<
      ApiListResponse<ApiSubmission>,
      string
    >({
      query: (id) => ({
        url: `/submissions/${id}/unread`,
        method: "PATCH",
      }),
      invalidatesTags: ["submissions", "dashboard"],
    }),

    getForwardEmail: build.query<
      ApiListResponse<{ forwardEmail: string | null }>,
      void
    >({
      query: () => ({
        url: "/submissions/forward-email",
        method: "GET",
      }),
      providesTags: ["submissions"],
    }),

    updateForwardEmail: build.mutation<
      ApiListResponse<{ forwardEmail: string }>,
      { forwardEmail: string }
    >({
      query: (data) => ({
        url: "/submissions/forward-email",
        method: "PATCH",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["submissions"],
    }),
  }),
});

export const {
  useGetSubmissionsQuery,
  useGetSubmissionsUnreadCountQuery,
  useMarkSubmissionReadMutation,
  useMarkSubmissionUnreadMutation,
  useGetForwardEmailQuery,
  useUpdateForwardEmailMutation,
} = submissionsApi;
