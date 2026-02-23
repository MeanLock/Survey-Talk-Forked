import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/query";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/rootReducer";
import { JwtUtil } from "@/core/utils/jwt.util";

export const GET_QUERY_KEY = "get-features";

const get = async () => {
  const response = await callAxiosRestApi({
    instance: loginRequiredAxiosInstance,
    method: "get",
    url: `Survey/core/feature/surveys`,
  });

  return response.data;
};

export const getTodDoOptions = () =>
  queryOptions({
    queryKey: [GET_QUERY_KEY],
    queryFn: () => get(),
  });

type UseGetType = {
  queryConfig?: QueryConfig<typeof getTodDoOptions>;
};

export const useGetFeatureSurveys = ({ queryConfig }: UseGetType) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isValidToken = token ? JwtUtil.isTokenValid(token) : false;

  return useQuery({
    ...getTodDoOptions(),
    ...queryConfig,
    enabled: isValidToken,
  });
};
