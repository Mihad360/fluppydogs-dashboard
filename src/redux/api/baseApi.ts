import { createApi } from "@reduxjs/toolkit/query/react";
import { envConfig } from "../../config/envConfig";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "auth",
    "user",
    "admin",
    "notification",
    "terms",
    "privacy",
    "about",
    "brands",
    "posts",
    "dashboard",
    "games",
    "submissions",
  ],
  baseQuery: axiosBaseQuery({
    baseUrl: envConfig.baseApi as string,
  }),
  endpoints: () => ({}),
});
