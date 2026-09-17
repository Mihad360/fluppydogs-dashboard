import { baseApi } from "./baseApi";
import type { ApiBrand, ApiListResponse } from "@/types/api";

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBrands: build.query<
      ApiListResponse<ApiBrand[]>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params: params || { limit: 100, sort: "sortOrder" },
      }),
      providesTags: ["brands"],
    }),

    createBrand: build.mutation<ApiListResponse<ApiBrand>, FormData>({
      query: (data) => ({
        url: "/brands/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["brands", "dashboard"],
    }),

    updateBrand: build.mutation<
      ApiListResponse<ApiBrand>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["brands", "dashboard", "posts"],
    }),

    deleteBrand: build.mutation<ApiListResponse<ApiBrand>, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brands", "dashboard"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
