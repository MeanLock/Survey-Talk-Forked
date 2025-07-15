import { useGetSurveyDetails } from "@/services/Survey/Details/get-survey-details";
import { useGetSurveySummaries } from "@/services/Survey/Details/get-survey-summaries";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Thay useSearchParams bằng useParams
import "./styles.scss";
import SurveyTalkLoading from "@/views/components/common/loading";
import { HeaderInformations } from "./components/headerInformations";
import { QuestionPreview } from "./components/questionsPreview";
import { ResponseSummaries } from "./components/surveySummaries";

const SurveyDetailsPage = () => {
  // STATES
  const [showMode, setShowMode] = useState<string>("question-preview");

  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);

  // TANSTACK QUERY
  const { data: SurveyDetails, isLoading: isLoadingDetailsFromAPI } =
    useGetSurveyDetails({ id });

  const { data: SurveySummaries, isLoading: isLoadingSummariesFromAPI } =
    useGetSurveySummaries({ id });

  // HOOKS
  useEffect(() => {
    console.log("Survey ID:", id);
    console.log("Survey Details: ", SurveyDetails);
    console.log("\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
    console.log("Survey Summaries: ", SurveySummaries);
  }, [id, SurveyDetails, SurveySummaries]);

  if (!id) {
    return <div>Không tìm thấy ID khảo sát</div>;
  }

  return (
    <div className="survey-details-summaries w-full flex flex-col px-12 py-6 items-start">
      {isLoadingDetailsFromAPI || isLoadingSummariesFromAPI ? (
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
          <SurveyTalkLoading />
          <p className="text-2xl font-bold">
            Đang lấy chi tiết khảo sát cho bạn...
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5 items-start">
          <p className="survey-title">
            Chi tiết Khảo sát: {SurveyDetails.Title}
          </p>
          <HeaderInformations
            topicId={SurveyDetails.SurveyTopicId}
            specificTopicId={SurveyDetails.SurveySpecificTopicId}
            kpi={SurveyDetails.SurveyPrivateData.Kpi}
            startDate={SurveyDetails.StartDate}
            endDate={SurveyDetails.EndDate}
            totalPrice={
              SurveyDetails.SurveyPrivateData.TheoryPrice +
              SurveyDetails.SurveyPrivateData.ExtraPrice
            }
            SurveyTakenResults={SurveyDetails.SurveyTakenResults}
          />

          <div className="w-full flex items-center gap-10 mt-10">
            <p
              className={`cursor-pointer pb-1 transition-all duration-200 ${
                showMode === "question-preview"
                  ? "text-[#3e5dab] border-b-2 border-[#3e5dab] font-bold"
                  : "text-[#807D7D] hover:text-[#3e5dab]"
              }`}
              onClick={() => setShowMode("question-preview")}
            >
              Preview Questions
            </p>
            <p
              className={`cursor-pointer pb-1 transition-all duration-200 ${
                showMode === "survey-summaries"
                  ? "text-[#3e5dab] border-b-2 border-[#3e5dab] font-bold"
                  : "text-[#807D7D] hover:text-[#3e5dab]"
              }`}
              onClick={() => setShowMode("survey-summaries")}
            >
              Response Summarize
            </p>
          </div>

          {showMode === "question-preview" && (
            <QuestionPreview questions={SurveyDetails.Questions} />
          )}

          {showMode === "survey-summaries" && <ResponseSummaries summaryLists={SurveySummaries} />}
        </div>
      )}
    </div>
  );
};

export default SurveyDetailsPage;
