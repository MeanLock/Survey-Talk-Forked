import type React from "react";
import type { SurveyCommunity } from "@/core/types";
import "./styles.scss";
import StarsIcon from "@mui/icons-material/Stars";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Props {
  data: SurveyCommunity | null;
}

export const SurveyCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="survey-card w-[381px] h-[546px] p-5 gap-5 flex flex-col items-center bg-white">
      <div className="survey-card__image w-[333px] h-[237px]">
        <img
          src={data?.MainImageUrl || "/placeholder.svg"}
          alt={data?.Title}
          className="w-[333px] h-[237px] object-cover"
        />
      </div>
      <p className="survey-card__title">{data?.Title}</p>
      <p className="survey-card__description">{data?.Description}</p>
      <div className="survey-card__reward-container mt-2 pr-2 w-11/12 flex items-center justify-between">
        <div className="survey-card__reward-container__point ">
          <div className="base flex items-center relative gap-1">
            <StarsIcon sx={{ color: "#FFC40D" }} />
            <p>{data?.TakerBaseRewardPrice}</p>
            <div className="bonus top-[-15px] right-[-30px]">
              {(
                data?.CurrentSurveyRewardTracking?.RewardPrice -
                data?.TakerBaseRewardPrice
              ).toLocaleString("vn")}
            </div>
          </div>
        </div>
        <div className="survey-card__reward-container__xp">
          <div className="value flex items-center gap-1">
            <AutoAwesomeIcon sx={{ color: "#FF7F0E" }} />
            <p>{data?.CurrentSurveyRewardTracking.RewardXp}</p>
          </div>
        </div>
      </div>
      <div
        onClick={() =>
          window.open(
            `/survey/${data?.Id}/taking?taking_subject=LevelUpdate`,
            "_blank"
          )
        }
        className="survey-card__button"
      >
        VÀO LÀM KHẢO SÁT
      </div>
      {data && data.SlotsLeft && data.SlotsLeft <= 10 && (
        <div className="survey-card__slot-count">
          <div className="slot-pin"></div>
          <div className="slot-text flex flex-col items-center">
            <span className="slot-number">{data.SlotsLeft}</span>
            <span className="slot-label">turns left</span>
          </div>
        </div>
      )}
    </div>
  );
};
