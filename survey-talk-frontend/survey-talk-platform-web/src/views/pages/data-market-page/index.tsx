// import { useEffect, useState } from "react";
// import type { SurveyDataMarket } from "../../../core/types";
// import { SurveyDataMarketCustomer } from "../../../core/mockData/mockData";
// import SurveyTalkLoading from "../../components/common/loading";
// import { SurveyDataMarketCard } from "./components/SurveyDataMarketCard";
// import { useNavigate } from "react-router-dom";

import { ToBeContinue } from "@/views/components/common/tobecontinue/ToBeContinue";

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
        <div className="mt-10 flex items-center justify-center">
          <ToBeContinue />
        </div>
      </div>
    </div>
  );
};

export default DataMarketPage;
