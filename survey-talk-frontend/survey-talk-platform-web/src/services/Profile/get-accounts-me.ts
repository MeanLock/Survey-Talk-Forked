import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { toast } from "react-toastify";

export const getAccountMe = async () => {
  let user = {};
  const response = await callAxiosRestApi({
    instance: loginRequiredAxiosInstance,
    method: "get",
    url: `User/accounts/me`,
  });
  if (response && response.data) {
    user = {
      Id: response.data.Account.Id,
      RoleId: response.data.Account.Role.Id,
      FullName: response.data.Account.FullName,
      Balance: response.data.Account.Balance,
      IsVerified: response.data.Account.IsVerified,
      Xp: response.data.Account.Xp,
      Level: response.data.Account.Level,
      IsFilterSurveyRequired: response.data.Account.IsFilterSurveyRequired,
      LastFilterSurveyTakenAt:
        response.data.Account.LastFilterSurveyTakenAt,
      MainImageUrl: response.data.Account.MainImageUrl,
      Profile: response.data.Account.Profile,
    };
    return {
        user: user,
        profile: response.data
    };
  } else {
    toast.error("Error while get User New Informations");
    return null;
  }
};
