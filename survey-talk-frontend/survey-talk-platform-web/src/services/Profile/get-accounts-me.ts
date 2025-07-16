import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { toast } from "react-toastify";

type Profile = {
  AccountId: number;
  CountryRegion: string | null;
  MaritalStatus: string | null;
  AverageIncome: string | null;
  EducationLevel: string | null;
  JobField: string | null;
  ProvinceCode: number | null;
  DistrictCode: number | null;
  WardCode: number | null;
} | null;

export type UserInformations = {
  Id: number;
  RoleId: number;
  FullName: string;
  Balance: number;
  IsVerified: boolean;
  Xp: number;
  Level: number;
  IsFilterSurveyRequired: boolean;
  LastFilterSurveyTakenAt: string;
  MainImageUrl: string;
  Profile: Profile | null;
};

export const getAccountMe = async (): Promise<{
  user: UserInformations;
} | null> => {
  let user = {} as UserInformations;
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
      LastFilterSurveyTakenAt: response.data.Account.LastFilterSurveyTakenAt,
      MainImageUrl: response.data.Account.MainImageUrl,
      Profile: response.data.Account.Profile,
    };
    return {
      user,
    };
  } else {
    toast.error("Error while get User New Informations");
    return null;
  }
};
