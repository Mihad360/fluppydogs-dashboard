import { baseApi } from "./baseApi";
import type { ApiListResponse, ApiOverview } from "@/types/api";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOverview: build.query<ApiListResponse<ApiOverview>, void>({
      query: () => ({
        url: "/dashboard/overview",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetOverviewQuery } = dashboardApi;
