import { useEffect, useState } from "react";
import type {
  DataMarketQuestion,
  SurveyDataMarketDetails,
} from "../../../../core/types";
import { callAxiosRestApi } from "../../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../../core/api/rest-api/config/instances/v2";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SurveyDataMarketCustomerDetails } from "../../../../core/mockData/mockData";
import SurveyTalkLoading from "../../../components/common/loading";
import "./styles.scss";

export type VersionInfo = {
  Title: string;
  QuestionCount: number;
  StartDate: string;
  EndDate: string | null;
  NumOfCountributor: number;
  VersionPrice: number;
  Questions: DataMarketQuestion[];
};

const DataMarketDetailsPage = () => {
  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SurveyDataMarketDetails | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(1);
  const [selectedVersionData, setSelectedVersionData] =
    useState<VersionInfo | null>(null);

  // HOOKS
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      // const response = await callAxiosRestApi({
      //   instance: loginRequiredAxiosInstance,
      //   method: "get",
      //   url: `Survey/core/market-research/surveys/${id}`,
      // });
      // if (response && response.success) {
      //   setData(response.data.Survey);
      //   handleChangeVersion(1, response.data.Survey);
      // }
      setTimeout(() => {
        const response = SurveyDataMarketCustomerDetails;
        setData(response);
        handleChangeVersion(1, response);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      //console.log("Lỗi khi fetch DataMarket Details: ", error);
    }
  };

  const handleChangeVersion = (
    version: number,
    dataFromAPI: SurveyDataMarketDetails | null
  ) => {
    setIsLoading(true);
    if (dataFromAPI) {
      const versionTracking = dataFromAPI.VersionTrackings.filter(
        (vt) => vt.Version === version
      )[0];
      const versionQuestions = dataFromAPI.Questions.filter(
        (q) => q.Version === version
      );
      const versionInfo: VersionInfo = {
        Title: dataFromAPI.Title,
        QuestionCount: versionQuestions.length,
        StartDate: dataFromAPI.StartDate,
        EndDate: dataFromAPI.EndDate ? dataFromAPI.EndDate : null,
        NumOfCountributor: versionTracking.ContributorCount,
        VersionPrice: versionTracking.CurrentVersionPrice,
        Questions: versionQuestions,
      };
      setTimeout(() => {
        setSelectedVersion(version);
        setSelectedVersionData(versionInfo);
        setIsLoading(false);
      }, 1000);
    } else if (data) {
      const versionTracking = data.VersionTrackings.filter(
        (vt) => vt.Version === version
      )[0];
      const versionQuestions = data.Questions.filter(
        (q) => q.Version === version
      );
      const versionInfo: VersionInfo = {
        Title: data.Title,
        QuestionCount: versionQuestions.length,
        StartDate: data.StartDate,
        EndDate: data.EndDate ? data.EndDate : null,
        NumOfCountributor: versionTracking.ContributorCount,
        VersionPrice: versionTracking.CurrentVersionPrice,
        Questions: versionQuestions,
      };
      setTimeout(() => {
        setSelectedVersion(version);
        setSelectedVersionData(versionInfo);
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error("Không tìm thấy data market!");
    }
  };

  return (
    <div className="w-full p-10 flex flex-col">
      {isLoading ? (
        <div className="w-full h-[500px] flex flex-col justify-center items-center">
          <SurveyTalkLoading />
          <p className="text-2xl font-bold">
            Đang Lọc Theo Version cho bạn ...
          </p>
        </div>
      ) : (
        <div className="data-details w-full flex flex-col gap-5">
          <div className="button-group w-full flex items-center">
            <div className="version-buttons flex items-center gap-5">
              {data?.VersionTrackings.map((v, index) => (
                <div
                  onClick={() => handleChangeVersion(v.Version, null)}
                  className={`version-button ${
                    v.Version === selectedVersion && "active-button"
                  }`}
                >
                  Version {v.Version}
                </div>
              ))}
            </div>
          </div>
          <div>b</div>
        </div>
      )}
    </div>
  );
};

export default DataMarketDetailsPage;
