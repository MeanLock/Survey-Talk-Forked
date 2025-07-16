import { queryOptions, useQuery } from "@tanstack/react-query";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/rootReducer";
import { JwtUtil } from "@/core/utils/jwt.util";
import type { QueryConfig } from "@/lib/query";

export const GET_QUERY_KEY = "get-me-surveys";

// Hàm gọi API thực tế
const get = async (params: {
  Keywords: string | null;
  Deadline: string | null;
  Status: string | null;
}) => {
  const { Keywords, Deadline, Status } = params;

  const response = await callAxiosRestApi({
    instance: loginRequiredAxiosInstance,
    method: "get",
    url: `Survey/core/community/surveys/me`,
    config: {
      params: {
        Keywords,
        Deadline,
        Status,
      },
    },
  });

  return response.data.Surveys;
};

// Tạo queryOptions cho useQuery
export const getMeSurveysOptions = (params: {
  Keywords: string | null;
  Deadline: string | null;
  Status: string | null;
}) =>
  queryOptions({
    queryKey: [GET_QUERY_KEY, params.Keywords, params.Deadline, params.Status],
    queryFn: () => get(params),
  });

type UseGetType = {
  queryConfig?: QueryConfig<ReturnType<typeof get>>;
  Keywords: string | null;
  Deadline: string | null;
  Status: string | null;
};

// Hook chính
export const useGetMeSurveys = ({
  queryConfig,
  Keywords,
  Deadline,
  Status,
}: UseGetType) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isValidToken = token ? JwtUtil.isTokenValid(token) : false;

  return useQuery({
    ...getMeSurveysOptions({ Keywords, Deadline, Status }),
    ...queryConfig,
    enabled: isValidToken && (queryConfig?.enabled ?? true),
  });
};
