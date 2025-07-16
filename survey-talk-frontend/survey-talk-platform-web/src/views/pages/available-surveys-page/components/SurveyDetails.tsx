import type { SurveyFromSurveyListCustomer } from "../../../../core/types";
import "./styles.scss";
import SurveyCardDefaultImg from "../../../../assets/Image/Logo/SurveyCardDefaultImg.png";
interface Props {
  survey: SurveyFromSurveyListCustomer | null;
}

export const SurveyDetail: React.FC<Props> = ({ survey }) => {
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
    return Math.floor((averageTime * questionCount) / 60) + 1;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng dd/mm/yyyy
  };

  return (
    <div className="survey-detail p-5">
      {!survey ? (
        <p>Đang lỗi không có data</p>
      ) : (
        <>
          <div className="header flex flex-col items-center gap-2">
            <img
              src={
                survey.MainImageUrl ? survey.MainImageUrl : SurveyCardDefaultImg
              }
              className="w-[106px] h-[106px] object-cover"
            />

            <p className="title">{survey.Title}</p>
          </div>

          <div className="w-full h-[1px] bg-gray-500 my-2"></div>

          <div className="informations-and-reward__container w-full flex flex-col gap-5">
            <div className="informations w-full flex flex-col items-start">
              <p className="text-lg font-bold">Survey Info</p>
              <div className="pl-3 w-full flex flex-col items-start gap-2">
                <div className="w-full text-[12px] flex justify-start items-center">
                  <p>
                    ● This survey contains{" "}
                    <span className="font-bold text-[#F87254]">
                      {survey.QuestionCount} questions
                    </span>
                  </p>
                </div>
                <div className="w-full text-[12px] flex justify-start items-center">
                  <p className="w-full text-left">
                    ● It will took you{" "}
                    <span className="font-bold text-[#389CF3]">
                      {timeCal(survey.QuestionCount, survey.SecurityModeId)}{" "}
                      minutes
                    </span>{" "}
                    to complete the survey
                  </p>
                </div>
                <div className="w-full text-[12px] flex justify-start items-center">
                  <p className="w-full text-left">
                    ● Published by Requester at{" "}
                    <span className="font-bold text-[#50A350]">
                      {formatDate(survey.PublishedAt)}
                    </span>
                  </p>
                </div>
                <div className="w-full text-[12px] flex justify-start items-center">
                  <p className="w-full text-left">
                    ● Any suspicious actions while taking survey will{" "}
                    <span className="font-bold text-[#D21B1B]">
                      be report and banned from the Platform
                    </span>
                    .
                  </p>
                </div>
                <div
                  style={{ fontStyle: "italic" }}
                  className="w-full text-[9px] flex justify-start items-center"
                >
                  <p
                    style={{ fontStyle: "italic" }}
                    className="w-full cursor-pointer text-left text-[#2B67F6] hover:underline"
                  >
                    For more informations about Taking Survey's Rules, please
                    click this link.
                  </p>
                </div>
              </div>
            </div>

            <div className="informations w-full flex flex-col items-start">
              <p className="text-lg font-bold">Reward Analysis</p>
              <div className="pl-3 w-full flex flex-col items-start gap-2">
                <div className="w-full text-[12px] flex justify-start items-center">
                  <p className="font-light text-gray-400">
                    ● Base Reward:{" "}
                    <span className="font-bold text-[#F87254]">
                      {survey.TakerBaseRewardPrice} points
                    </span>
                  </p>
                </div>

                <div className="w-full text-[12px] flex justify-start items-center">
                  <p className="font-light text-gray-400">
                    ● Time Reward:{" "}
                    <span className="font-bold text-[#F87254]">
                      {survey.CurrentSurveyRewardTracking.RewardPrice -
                        survey.TakerBaseRewardPrice}{" "}
                      points
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center">
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
        </>
      )}
    </div>
  );
};
