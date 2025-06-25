import { useEffect, useState } from "react";
import type { SurveyDataMarket } from "../../../core/types";
import { SurveyDataMarketCustomer } from "../../../core/mockData/mockData";
import SurveyTalkLoading from "../../components/common/loading";
import { SurveyDataMarketCard } from "./components/SurveyDataMarketCard";
import { useNavigate } from "react-router-dom";

const DataMarketPage = () => {
  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState<SurveyDataMarket[] | null>(null);
  const [searchedSurveys, setSearchedSurveys] = useState<
    SurveyDataMarket[] | null
  >(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyDataMarket | null>(
    null
  );
  const [isShowSelectedSurvey, setIsShowSelectedSurvey] = useState(false);

  // HOOKS
  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, []);

  const navigate = useNavigate();

  // FUNCTIONS
  const fetch = async () => {
    try {
      setTimeout(() => {
        const response = SurveyDataMarketCustomer;
        setSurveys(response);
        setSearchedSurveys(response);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Lỗi khi fetch Data Market Survey: ", error);
    }
  };

  const handleViewDetail = (id: number) => {
    const survey = surveys?.filter((s) => s.Id === id)[0];
    if (survey) {
      setSelectedSurvey(survey);
      navigate(`/data-market/details?id=${id}`);
    } else {
      setSelectedSurvey(null);
    }
  };

  return (
    <div className="data-market-screen w-full">
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <SurveyTalkLoading />
          <p>Đang tìm các bộ Data phù hợp với bạn!</p>
        </div>
      ) : (
        <div className="data-market__container w-full flex flex-col gap-5">
          <div className="data-market__search-container">
            <p>Chỗ Search</p>
          </div>
          <div className="data-market__survey-list w-full p-10 grid grid-cols-4 gap-5">
            {searchedSurveys?.map((s, index) => (
              <div className="col-span-1 w-full flex items-center justify-center">
                <SurveyDataMarketCard
                  key={index}
                  survey={s}
                  onViewDetail={handleViewDetail}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMarketPage;
