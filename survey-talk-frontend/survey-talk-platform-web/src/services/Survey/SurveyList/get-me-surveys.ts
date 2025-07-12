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
  KeyWord: string | null;
  Deadline: string | null;
  StatusId: number | null;
}) => {
  const { KeyWord, Deadline, StatusId } = params;

  const response = await callAxiosRestApi({
    instance: loginRequiredAxiosInstance,
    method: "get",
    url: `Survey/core/community/surveys/me`,
    config: {
      params: {
        KeyWord,
        Deadline,
        StatusId,
      },
    },
  });

  return response.data.Surveys;
};

// Tạo queryOptions cho useQuery
export const getMeSurveysOptions = (params: {
  KeyWord: string | null;
  Deadline: string | null;
  StatusId: number | null;
}) =>
  queryOptions({
    queryKey: [GET_QUERY_KEY, params.KeyWord, params.Deadline, params.StatusId],
    queryFn: () => get(params),
  });

type UseGetType = {
  queryConfig?: QueryConfig<ReturnType<typeof get>>;
  KeyWord: string | null;
  Deadline: string | null;
  StatusId: number | null;
};

// Hook chính
export const useGetMeSurveys = ({
  queryConfig,
  KeyWord,
  Deadline,
  StatusId,
}: UseGetType) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isValidToken = token ? JwtUtil.isTokenValid(token) : false;

  return useQuery({
    ...getMeSurveysOptions({ KeyWord, Deadline, StatusId }),
    ...queryConfig,
    enabled: isValidToken && (queryConfig?.enabled ?? true),
  });
};
