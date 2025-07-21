import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";

export const GetFilterSurveyId = async () => {
  try {
    const response = await callAxiosRestApi({
      instance: loginRequiredAxiosInstance,
      method: "get",
      url: `Survey/core/available-filter-survey`,
    });
    if (response && response.success && response.data) {
      return response.data.Survey.Id;
    } else if (response && !response.success) {
      return null;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error While Getting Filter Survey: ", error);
    return null;
  }
};
