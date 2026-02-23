import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { toast } from "react-toastify";
import { GetFilterSurveyId } from "../Survey/FilterSurvey/get-filter-survey";

export type UserStatus = {
  Id: number;
  IsFilterSurveyNeeded: boolean;
  FilterSurveyId: number;
  IsRatingNeeded: boolean;
};

const IsAfterFiveHour = (stringDate: string): boolean => {
  try {
    const createdDate = new Date(stringDate);
    const currentDate = new Date();

    // Tính số milliseconds giữa 2 thời điểm
    const timeDifference = currentDate.getTime() - createdDate.getTime();

    // Chuyển đổi sang giờ (5 giờ = 5 * 60 * 60 * 1000 milliseconds)
    const fiveHoursInMs = 5 * 60 * 60 * 1000;

    return timeDifference > fiveHoursInMs;
  } catch (error) {
    console.error("Error parsing date in IsAfterFiveHour:", error);
    return false;
  }
};

// Kiểm tra xem updatedAt và createdAt có khác nhau không (đã có sự thay đổi)
const IsDifferentTime = (stringDate1: string, stringDate2: string): boolean => {
  try {
    const date1 = new Date(stringDate1);
    const date2 = new Date(stringDate2);

    // So sánh thời gian theo milliseconds
    return date1.getTime() !== date2.getTime();
  } catch (error) {
    console.error("Error parsing dates in IsDifferentTime:", error);
    return false;
  }
};

export const getAccountStatus = async (): Promise<{
  status: UserStatus;
} | null> => {
  try {
    const response = await callAxiosRestApi({
      instance: loginRequiredAxiosInstance,
      method: "get",
      url: `User/accounts/me`,
    });

    if (!response?.data) {
      toast.error("Error while get User New Informations");
      return null;
    }

    const user = response.data.Account;
    const status: UserStatus = {
      Id: user.Id,
      IsFilterSurveyNeeded: false,
      FilterSurveyId: 0,
      IsRatingNeeded: false,
    };

    // Check if filter survey is needed
    if (user.IsFilterSurveyRequired) {
      status.IsFilterSurveyNeeded = true;
      const surveyId = await GetFilterSurveyId();
      if (surveyId) {
        status.FilterSurveyId = surveyId;
      }
    }

    // Check if rating is needed: chưa đưa feedback + đã qua 5 giờ + có thay đổi
    if (
      !user.IsPlatformFeedbackGiven &&
      IsAfterFiveHour(user.CreatedAt) &&
      IsDifferentTime(user.CreatedAt, user.UpdatedAt)
    ) {
      status.IsRatingNeeded = true;
    }

    return { status };
  } catch (error) {
    console.error("Error in getAccountStatus:", error);
    toast.error("Error while get User New Informations");
    return null;
  }
};
