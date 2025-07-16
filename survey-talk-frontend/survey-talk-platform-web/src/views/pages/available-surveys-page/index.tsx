import type React from "react";
import NotFoundImg from "../../../assets/Image/Logo/notfound.png";
import type {
  SurveyFromSurveyListCustomer,
  SurveyTopic,
} from "../../../core/types";
import { useEffect, useState } from "react";
import "./styles.scss";
import { SurveyDetail } from "./components/SurveyDetails";
import SurveyTalkLoading from "../../components/common/loading";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../core/api/rest-api/config/instances/v2";
import { toast } from "react-toastify";
import {
  SurveyListCustomer,
  SurveyTopics,
} from "../../../core/mockData/mockData";
import { SurveyCard } from "./SurveyCard";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

// FILTER ICON
import TuneIcon from "@mui/icons-material/Tune";
import { Tune } from "@mui/icons-material";
import { SearchSurvey } from "./SearchSurvey";
import CloseIcon from "@mui/icons-material/Close";
import { useGetCommunitySurveys } from "@/services/Survey/SurveyList/get-community-surveys";

interface AvailableSurveyProps {}

const SortModeOptions = [
  { mode: 1, text: "Sort: Publish Date (latest)" },
  { mode: 2, text: "Sort: Publish Date (earliest)" },
  { mode: 3, text: "Sort: Reward (Biggest)" },
  { mode: 4, text: "Sort: Reward (Smallest)" },
];

const AvailableSurveys: React.FC<AvailableSurveyProps> = () => {
  // STATES
  const [isLoading, setIsLoading] = useState(true);

  const [surveys, setSurveys] = useState<SurveyFromSurveyListCustomer[] | null>(
    null
  );
  const [filteredSurveys, setFilteredSurveys] = useState<
    SurveyFromSurveyListCustomer[] | null
  >(null);

  const [selectedSurvey, setSelectedSurvey] =
    useState<SurveyFromSurveyListCustomer | null>(null);
  const [isShowSelectedSurvey, setIsShowSelectedSurvey] = useState(false);

  const [Keyword, setKeyword] = useState("");
  const [Additional, setAdditional] = useState("");

  const [sortMode, setSortMode] = useState(0);
  const [topics, setTopics] = useState<SurveyTopic[] | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);

  const [surveyFoundCount, setSurveyFoundCount] = useState(0);

  const {
    data: CommunitySurveysFromAPI,
    isLoading: isLoadingCommunitySurveys,
    isFetched,
  } = useGetCommunitySurveys({});

  // HOOKS
  useEffect(() => {
    // setIsLoading(true);
    // fetch();
    if (CommunitySurveysFromAPI) {
      setSurveys(CommunitySurveysFromAPI);
      setFilteredSurveys(CommunitySurveysFromAPI);
      setSurveyFoundCount(
        CommunitySurveysFromAPI ? CommunitySurveysFromAPI.length : 0
      );
      setTopics(SurveyTopics);
      setSelectedSurvey(null);
      setIsShowSelectedSurvey(false);
      setSelectedTopics([]);
      setSortMode(0);
      setIsLoading(false);
    }
  }, [CommunitySurveysFromAPI]);

  // FUNCTIONS
  // const fetch = async () => {
  //   try {
  //     // CALL API, MỞ LẠI SAU KHI ĐÃ CÓ DATA
  //     // const response = await callAxiosRestApi({
  //     //   instance: loginRequiredAxiosInstance,
  //     //   method: "get",
  //     //   url: `Survey/core/community/surveys?Keyword=${Keyword}&Additional=${Additional}`,
  //     // });
  //     // if (response.success) {
  //     //   const surveys = response.data.Surveys;
  //     //   setSurveys(surveys);
  //     //   setFilteredSurveys(surveys);
  //     //   setSurveyFoundCount(surveys.length);
  //     //   setSelectedSurvey(null);
  //     //   setIsShowSelectedSurvey(false);
  //     //   setSelectedTopics(null);
  //     //   setSortMode(0);
  //     //   setIsLoading(false);
  //     // }else{
  //     //   toast.error(`Lỗi khi tìm kiếm Khảo sát phù hợp, vui lòng thử lại sau!`);
  //     // }

  //     // FAKE CALL API NÈ
  //     setTimeout(() => {
  //       const surveys = SurveyListCustomer;
  //       setSurveys(surveys);
  //       setFilteredSurveys(surveys);
  //       setSurveyFoundCount(surveys ? surveys.length : 0);
  //       setSelectedSurvey(null);
  //       setIsShowSelectedSurvey(false);
  //       setSelectedTopics([]);
  //       setSortMode(0);
  //       setIsLoading(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.log("Lỗi khi lấy danh sách Khảo sát phù hợp: ", error);
  //   }
  // };

  const handleShowDetail = (id: number) => {
    const survey = surveys?.filter((s) => s.Id === id)[0];
    setSelectedSurvey(survey ? survey : null);
    setIsShowSelectedSurvey(survey ? true : false);
  };

  const onCloseDetailsModal = () => {
    setSelectedSurvey(null);
    setIsShowSelectedSurvey(false);
  };

  const handleSortChange = (mode: number) => {
    setSortMode(mode);

    if (filteredSurveys) {
      let sortedSurveys = [...filteredSurveys];

      if (mode === 1) {
        sortedSurveys = sortedSurveys.sort(
          (a, b) =>
            new Date(b.PublishedAt).getTime() -
            new Date(a.PublishedAt).getTime()
        );
      } else if (mode === 2) {
        sortedSurveys = sortedSurveys.sort(
          (a, b) =>
            new Date(a.PublishedAt).getTime() -
            new Date(b.PublishedAt).getTime()
        );
      } else if (mode === 3) {
        sortedSurveys = sortedSurveys.sort(
          (a, b) =>
            b.CurrentSurveyRewardTracking.RewardPrice -
            a.CurrentSurveyRewardTracking.RewardPrice
        );
      } else if (mode === 4) {
        sortedSurveys = sortedSurveys.sort(
          (a, b) =>
            a.CurrentSurveyRewardTracking.RewardPrice -
            b.CurrentSurveyRewardTracking.RewardPrice
        );
      }

      setFilteredSurveys(sortedSurveys);
    }
  };

  const getTopicName = (id: number) => {
    // return SurveyTopics.filter((t) => t.id === id)[0].name;
    return "Chưa xác định";
  };

  const handleTopicFilterChange = (topicId: number) => {
    let topics = [...selectedTopics]; // Tạo bản sao của mảng selectedTopics
    const isTopicSelected = topics.includes(topicId);

    if (isTopicSelected) {
      // Nếu topic đã được chọn, loại bỏ nó khỏi mảng
      topics = topics.filter((id) => id !== topicId);
    } else {
      // Nếu topic chưa được chọn, thêm nó vào mảng
      topics.push(topicId);
    }

    setSelectedTopics(topics);

    // Lọc mảng surveys theo topics
    let filtered = surveys || [];
    if (topics.length > 0) {
      filtered = filtered.filter((survey) =>
        topics.includes(survey.SurveyTopicId)
      );
    }

    // Áp dụng logic sort hiện tại lên danh sách đã filter
    if (sortMode === 1) {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.PublishedAt).getTime() - new Date(a.PublishedAt).getTime()
      );
    } else if (sortMode === 2) {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.PublishedAt).getTime() - new Date(b.PublishedAt).getTime()
      );
    } else if (sortMode === 3) {
      filtered = filtered.sort(
        (a, b) =>
          b.CurrentSurveyRewardTracking.RewardPrice -
          a.CurrentSurveyRewardTracking.RewardPrice
      );
    } else if (sortMode === 4) {
      filtered = filtered.sort(
        (a, b) =>
          a.CurrentSurveyRewardTracking.RewardPrice -
          b.CurrentSurveyRewardTracking.RewardPrice
      );
    }

    // Cập nhật danh sách filteredSurveys và số lượng khảo sát tìm thấy
    setFilteredSurveys(filtered);
    setSurveyFoundCount(filtered.length);
  };

  const handleSearchAPI = async () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        const surveys = SurveyListCustomer;
        setSurveys(surveys);
        setFilteredSurveys(surveys);
        setSurveyFoundCount(surveys ? surveys.length : 0);
        setSelectedSurvey(null);
        setIsShowSelectedSurvey(false);
        setSelectedTopics([]);
        setSortMode(0);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Lỗi khi handleSearchAPI");
    }
  };

  const handleAdditionalChangeAPI = async (content: string) => {
    setAdditional(content);
    try {
      setIsLoading(true);
      setTimeout(() => {
        const surveys = SurveyListCustomer;
        setSurveys(surveys);
        setFilteredSurveys(surveys);
        setSurveyFoundCount(surveys ? surveys.length : 0);
        setSelectedSurvey(null);
        setIsShowSelectedSurvey(false);
        setSelectedTopics([]);
        setSortMode(0);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Lỗi khi handleSearchAPI");
    }
  };

  // LỖI Ở HÀM NÀY
  const handleClearFilter = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedTopics([]);
      setAdditional("");
      if (Keyword === "") {
        setFilteredSurveys(SurveyListCustomer);
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="survey-list w-full flex flex-col items-center p-10">
      {isLoadingCommunitySurveys ? (
        <>
          <SurveyTalkLoading />
          <p className="text-2xl font-bold">
            Đang lấy những khảo sát phù hợp nhất với bạn!
          </p>
        </>
      ) : (
        <div className="survey-list-container w-full flex flex-col gap-5">
          <div className="search-and-filter__container w-full flex flex-col">
            <div className="search-and-filter__actions w-full flex h-9 order-1 border-gray-400 mb-3">
              <SearchSurvey
                keyword={Keyword}
                setKeyword={setKeyword}
                additional={Additional}
                handleAddtionalChange={handleAdditionalChangeAPI}
                selectedTopics={selectedTopics}
                handleTopicFilterChange={handleTopicFilterChange}
                handleSearchAPI={handleSearchAPI}
              />
            </div>
          </div>

          <div className="search-and-filter__data-display w-full flex items-center gap-2">
            {Additional !== "" && (
              <div className="p-2 bg-[#FBEFC7] rounded-md text-[#EAB308] flex items-center justify-center">
                {Additional}
              </div>
            )}
            {selectedTopics.map((st, index) => (
              <div
                key={index}
                className="p-2 bg-[#E0E8FF] rounded-md text-[#7A8FC5] flex items-center justify-center"
              >
                {getTopicName(st)}
              </div>
            ))}

            {(Additional !== "" || selectedTopics.length > 0) && (
              <Button
                onClick={() => handleClearFilter()}
                color="primary"
                variant="text"
                startIcon={<CloseIcon />}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="count-and-sort__container w-full flex items-center justify-between">
            <div className="count flex items-center gap-1 text-2xl font-bold">
              <p>Survey Found:</p>
              <p className="text-blue-600">{surveyFoundCount}</p>
            </div>

            <div className="sort flex items-center gap-3">
              <p className="text-2xl font-bold">Sort: </p>
              <Select
                value={sortMode}
                sx={{ width: "250px" }}
                label="Sort"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem key={"default"} value={0}>
                  Default
                </MenuItem>
                {SortModeOptions.map((s, index) => (
                  <MenuItem key={index} value={s.mode}>
                    {s.text}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          {surveyFoundCount === 0 ? (
            <div className="no-survey w-full flex-1 flex flex-col gap-4 items-center justify-center">
              <img src={NotFoundImg} className="w-[200px] h-[200px]" />
              <p className="font-bold text-gray-400">
                Không có Survey nào phù hợp với tiêu chí của bạn
              </p>
              <p className="italic text-gray-400">
                ~Vui lòng chọn các options khác nha~
              </p>
            </div>
          ) : (
            <div className="filtered-survey-list__container w-full grid grid-cols-12 gap-2">
              <div className="list__container col-span-8 flex flex-col gap-5">
                {filteredSurveys?.map((survey, index) => (
                  <SurveyCard
                    key={index}
                    survey={survey}
                    onShowDetail={handleShowDetail}
                  />
                ))}
              </div>
              <div className="survey-details__container col-span-4 flex items-start justify-end">
                {isShowSelectedSurvey && selectedSurvey && (
                  <SurveyDetail survey={selectedSurvey} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableSurveys;
