import type React from "react";
import type { SurveyFromSurveyListCustomer } from "../../../core/types";
import "./SurveyCardStyles.scss";
import SurveyCardDefaultImg from "../../../assets/Image/Logo/SurveyCardDefaultImg.png";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { SurveyTopics } from "../../../core/mockData/mockData";
import StarsIcon from "@mui/icons-material/Stars";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Props {
  survey: SurveyFromSurveyListCustomer;
  onShowDetail: (id: number) => void;
}
const handleTakeSurvey = () => {
  // Logic to handle taking the survey
  console.log("Taking survey:");
}
export const SurveyCard: React.FC<Props> = ({ survey, onShowDetail }) => {
  // FUNCTIONS
  const timeCal = (questionCount: number, security: number) => {
    let averageTime = 0;
    if (security === 1) {
      averageTime = 10;
    } else if (security === 2) {
      averageTime = 15;
    } else {
      averageTime = 25;
    }
    return [(averageTime * questionCount) % 60];
  };

  const topicName = (id: number) => {
    // const name = SurveyTopics.filter((s) => s.id === id)[0].name;
    // return name;
   return "Chưa xác định";  };

  return (
    <div
      onClick={() => onShowDetail(survey.Id)}
      className="survey-card__container w-full p-5 cursor-pointer"
    >
      {!survey ? (
        <div>Chưa có khảo sát</div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <div className="survey-card__header w-full flex items-center gap-5">
            <div className="survey-card__header-image flex items-center justify-center w-16 h-16">
              <img
                src={
                  survey.MainImageUrl
                    ? survey.MainImageUrl
                    : SurveyCardDefaultImg
                }
                className="w-16 h-16 object-cover"
              />
            </div>
            <div className="survey-card__header-informations flex-1 flex flex-col items-start h-16">
              <p className="survey-card__header-informations__title">
                {survey.Title}
              </p>
              <div className="survey-card__header-informations__attributes flex items-center gap-7">
                <div className="flex items-center gap-1">
                  <AccessTimeIcon
                    sx={{ width: "15px", height: "15px", color: "#2DD8C7" }}
                  />
                  <p>
                    {timeCal(survey.QuestionCount, survey.SecurityModeId)} mins
                  </p>
                </div>
                {survey.SecurityModeId === 3 && (
                  <div className="flex items-center gap-1">
                    <KeyboardVoiceIcon
                      sx={{ width: "15px", height: "15px", color: "#F87254" }}
                    />
                    <p>Take Survey By Your Voice.</p>
                  </div>
                )}
              </div>
            </div>
            {survey.SlotsLeft <= 10 && (
              <div className="survey-card__header__slot-count flex h-16 items-start ">
                <div className="survey-card__header__slot-count-container flex items-center gap-2">
                  <p className="number text-[24px] text-[#FF4E4E]">
                    {survey.SlotsLeft}
                  </p>
                  <p className="description">turns left.</p>
                </div>
              </div>
            )}
          </div>

          <div className="survey-card__description w-full flex items-center justify-start">
            <p className="survey-card__description-content w-full text-left">
              {survey.Description}
            </p>
          </div>

          <div className="survey-card__topic w-full flex items-center justify-start">
            <div className="p-2 bg-[#E0E8FF] rounded-md text-[#7A8FC5] flex items-center justify-center">
              {topicName(survey.SurveyTopicId)}
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-400"></div>

          <div className="survey-card__reward-and-actions w-full flex items-center justify-between">
            <div className="survey-card__reward flex gap-5">
              <div className="flex items-center gap-2">
                <StarsIcon
                  sx={{ color: "#27A1E8", width: "18px", height: "18px" }}
                />
                <div className="flex items-baseline gap-1">
                  <p className="font-bold text-[16px] p-0 m-0">
                    {survey.CurrentSurveyRewardTracking.RewardPrice.toLocaleString(
                      "vn"
                    )}{" "}
                  </p>
                  <p className="text-[10px] text-gray-500 p-0 m-0">
                    điểm / lượt làm
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AutoAwesomeIcon
                  sx={{ color: "#27A1E8", width: "18px", height: "18px" }}
                />
                <div className="flex items-baseline gap-1">
                  <p className="font-bold text-[16px] p-0 m-0">
                    {survey.CurrentSurveyRewardTracking.RewardXp.toLocaleString(
                      "vn"
                    )}{" "}
                  </p>
                  <p className="text-[10px] text-gray-500 p-0 m-0">
                    XP / lượt làm
                  </p>
                </div>
              </div>
            </div>

            <div className="survey-card__actions">
              <div className="px-3 py-1 bg-[#FF7260] text-white font-bold rounded-md hover:bg-[#EF2D13] cursor-pointer"
                onClick={() =>
                  window.open(
                    `/survey/${survey.Id}/taking?taking_subject=Verified`,
                    "_blank"
                  )
                }
              >
                Vào Làm Survey
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
