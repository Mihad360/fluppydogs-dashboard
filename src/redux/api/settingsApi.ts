import { baseApi } from "./baseApi";
import type { ApiListResponse } from "@/types/api";

export type LegalDocType = "privacy" | "terms" | "about";

export type ApiLegalDoc = {
  _id?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
} | null;

const legalEndpoints: Record<
  LegalDocType,
  { get: string; update: string; tag: "privacy" | "terms" | "about" }
> = {
  privacy: { get: "/privacy/", update: "/privacy/update", tag: "privacy" },
  terms: { get: "/term/", update: "/term/update", tag: "terms" },
  about: { get: "/about/", update: "/about/update", tag: "about" },
};

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalDoc: builder.query<ApiListResponse<ApiLegalDoc>, LegalDocType>({
      query: (type) => ({
        url: legalEndpoints[type].get,
        method: "GET",
      }),
      providesTags: (_result, _error, type) => [legalEndpoints[type].tag],
    }),

    updateLegalDoc: builder.mutation<
      ApiListResponse<ApiLegalDoc>,
      { type: LegalDocType; description: string }
    >({
      query: ({ type, description }) => ({
        url: legalEndpoints[type].update,
        method: "PATCH",
        contentType: "application/json",
        data: { description, [type]: description },
      }),
      invalidatesTags: (_result, _error, { type }) => [
        legalEndpoints[type].tag,
      ],
    }),

    // Keep legacy hooks for compatibility
    getAllAbout: builder.query<ApiListResponse<ApiLegalDoc>, void>({
      query: () => ({ url: "/about/", method: "GET" }),
      providesTags: ["about"],
    }),
    getAllPrivacy: builder.query<ApiListResponse<ApiLegalDoc>, void>({
      query: () => ({ url: "/privacy/", method: "GET" }),
      providesTags: ["privacy"],
    }),
    getAllTerms: builder.query<ApiListResponse<ApiLegalDoc>, void>({
      query: () => ({ url: "/term/", method: "GET" }),
      providesTags: ["terms"],
    }),
  }),
});

export const {
  useGetLegalDocQuery,
  useUpdateLegalDocMutation,
  useGetAllAboutQuery,
  useGetAllPrivacyQuery,
  useGetAllTermsQuery,
} = settingsApi;
