import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/query";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";

export const GET_QUERY_KEY = "get-account-details";

// API fetcher
const get = async () => {
  const response = await callAxiosRestApi({
    instance: loginRequiredAxiosInstance,
    method: "get",
    url: `User/accounts/me`,
  });
  return response.data.Account;
};

// Query Options
export const getEditSessionOptions = () =>
  queryOptions({
    queryKey: [GET_QUERY_KEY],
    queryFn: () => get(),
  });

// Hook
type UseGetType = {
  //   queryConfig?: QueryConfig<ReturnType<typeof getEditSessionOptions>>;
  queryConfig?: QueryConfig<Awaited<ReturnType<typeof get>>>;
  id: number;
};

export const useGetAccountDetails = ({ queryConfig }: UseGetType) => {
  return useQuery({
    ...getEditSessionOptions(),
    ...queryConfig,
    enabled: true, // giữ enabled trong queryConfig nếu có
  });
};
