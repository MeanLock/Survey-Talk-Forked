// import { useEffect, useState } from "react";
// import type { SurveyDataMarket } from "../../../core/types";
// import { SurveyDataMarketCustomer } from "../../../core/mockData/mockData";
// import SurveyTalkLoading from "../../components/common/loading";
// import { SurveyDataMarketCard } from "./components/SurveyDataMarketCard";
// import { useNavigate } from "react-router-dom";

const DataMarketPage = () => {
  // // STATES
  // const [isLoading, setIsLoading] = useState(true);
  // const [surveys, setSurveys] = useState<SurveyDataMarket[] | null>(null);
  // const [searchedSurveys, setSearchedSurveys] = useState<
  //   SurveyDataMarket[] | null
  // >(null);
  // const [selectedSurvey, setSelectedSurvey] = useState<SurveyDataMarket | null>(
  //   null
  // );
  // const [isShowSelectedSurvey, setIsShowSelectedSurvey] = useState(false);

  // // HOOKS
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch();
  // }, []);

  // const navigate = useNavigate();

  // // FUNCTIONS
  // const fetch = async () => {
  //   try {
  //     setTimeout(() => {
  //       const response = SurveyDataMarketCustomer;
  //       setSurveys(response);
  //       setSearchedSurveys(response);
  //       setIsLoading(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.log("Lỗi khi fetch Data Market Survey: ", error);
  //   }
  // };

  // const handleViewDetail = (id: number) => {
  //   const survey = surveys?.filter((s) => s.Id === id)[0];
  //   if (survey) {
  //     setSelectedSurvey(survey);
  //     navigate(`/data-market/details?id=${id}`);
  //   } else {
  //     setSelectedSurvey(null);
  //   }
  // };

  return (
    <div className="data-market-screen w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 rounded-lg">
        <h1 className="text-6xl font-bold mb-4 text-gray-600">Coming Soon</h1>
        <p className="text-xl text-gray-600">
          Chức năng Data Market sẽ ra mắt trong thời gian tới
        </p>
        <div className="mt-8">
          <div className="inline-block animate-pulse bg-gray-200 p-4 rounded-full">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMarketPage;