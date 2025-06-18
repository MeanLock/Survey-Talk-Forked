import React, { useEffect, useState } from "react";
import type { Survey, SurveyList, SurveyTopic } from "../../../../core/types";
import {
  SurveyCustomerMeData,
  SurveyMeData,
  SurveyTopics,
} from "../../../../core/mockData/mockData";
import "./styles.scss";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  TextField,
} from "@mui/material";

// Icon cho Search
import SearchIcon from "@mui/icons-material/Search";
// Icon cho Sort
import SwapVertIcon from "@mui/icons-material/SwapVert";
// Icon cho Filter
import FilterListIcon from "@mui/icons-material/FilterList";

// Icon cho Edit
import EditIcon from "@mui/icons-material/Edit";
// Icon cho Đăng Survey
import PublishIcon from "@mui/icons-material/Publish";
// Icon cho xem Details
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { SurveyMeCard } from "./SurveyMeCard";
import { PublishModal } from "./components/PublishModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/rootReducer";

type Query = {
  Keyword: string | null;
  Deadline: string | null;
  StatusId: number | null;
};

const ManageSurveyPage = () => {
  // REDUX FAKE NHỚ BỎ ĐI KHI ĐÃ CÓ API
  const fake = useSelector((state: RootState) => state.fake);
  const user = useSelector((state: RootState) => state.auth.user);
  // STATES
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [surveys, setSurveys] = useState<SurveyList | null>(null);
  const [filteredSurveys, setFilteredSurveys] = useState<SurveyList | null>(
    null
  );
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [topics, setTopics] = useState<SurveyTopic[] | null>(null);

  const [query, setQuery] = useState<Query>({
    Keyword: null,
    Deadline: null,
    StatusId: null,
  });
  const [filterOption, setFilterOption] = useState<string>("All");
  const [sortOptions, setSortOptions] = useState<string>("Ngày tạo: Sớm nhất");

  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // HOOKS
  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      setTimeout(() => {
        // CALL API RIGHT HERE TO FETCH
        const response =
          user?.FullName === "Hoàng Minh Lộc"
            ? SurveyCustomerMeData
            : SurveyMeData;
        console.log("response:", response);
        console.log("Fake Full Name: ", fake.FullName);
        console.log("User Name: ", user?.FullName);
        setSurveys(response);
        setFilteredSurveys(response);
        setTopics(SurveyTopics);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error while fetching surveys in manage-surveys: ", error);
    }
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterOption(value);
    console.log("Selected filter:", value); // Debug log
  };

  const handleFilterTopic = () => {};

  const handleSearch = () => {
    console.log("Tìm kiếm Survey với Keyword: ", query.Keyword);
  };

  const handleEdit = (id: number) => {};
  const handleViewDetail = (id: number) => {};
  const handlePublish = (id: number) => {
    const survey = surveys?.filter((s) => s.Id === id)[0];
    setSelectedSurvey(survey);
    setShowPublishModal(true);
  };
  const handleClosePublishModal = () => {
    setShowPublishModal(false);
    setSelectedSurvey(null);
  };
  const handleDelete = (id: number) => {};

  const changeSurveyStatus = (id: number) => {
    const updatedSurveys = surveys?.map((survey) =>
      survey.Id === id ? { ...survey, StatusId: 2 } : survey
    );
    setSurveys(updatedSurveys);
    setFilteredSurveys(updatedSurveys);
  };

  return (
    <div className="surveys-me w-full flex flex-col items-start p-10">
      <p className="surveys-me__title mb-2">Tài liệu khảo sát của tôi</p>
      <div className="surveys-me__filter-container pl-3 pr-5 py-3 gap-5 flex items-center justify-around">
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "All"}
            onChange={handleFilter}
            value="All"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "All" }}
          />
          <p>All</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "Editing"}
            onChange={handleFilter}
            value="Editing"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "Editing" }}
          />
          <p>Đang chỉnh sửa</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "OnDeadline"}
            onChange={handleFilter}
            value="OnDeadline"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "OnDeadline" }}
          />
          <p>On Deadline</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "NearDeadline"}
            onChange={handleFilter}
            value="NearDeadline"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "NearDeadline" }}
          />
          <p>Near Deadline</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "LateForDeadline"}
            onChange={handleFilter}
            value="LateForDeadline"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "LateForDeadline" }}
          />
          <p>Late For Deadline</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "Completed"}
            onChange={handleFilter}
            value="Completed"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "Completed" }}
          />
          <p>Hoàn Thành</p>
        </div>
        <div className="flex items-center gap-1">
          <Radio
            checked={filterOption === "Deactivated"}
            onChange={handleFilter}
            value="Deactivated"
            name="survey-filter-radio"
            inputProps={{ "aria-label": "Deactivated" }}
          />
          <p>Deactivated</p>
        </div>
      </div>

      <div className="surveys-me__search-topic-sort w-full grid grid-cols-12 my-7">
        <div className="surveys-me__search col-span-8">
          <TextField
            fullWidth
            placeholder="Tìm kiếm khảo sát..."
            value={query.Keyword}
            onChange={(e) => setQuery({ ...query, Keyword: e.target.value })}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#3E5DAB" }}
                    onClick={() => handleSearch()}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="surveys-me__topic col-span-2 flex items-center">
          <div className="flex w-full items-center justify-end">
            <Button
              color="primary"
              variant="outlined"
              sx={{ gap: "5px", width: "80%" }}
            >
              <p>Topics</p>
              <FilterListIcon />
            </Button>
          </div>
        </div>
        <div className="surveys-me__sort col-span-2 flex items-center">
          <div className="flex w-full items-center justify-start">
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              sx={{ gap: "5px", marginLeft: "10px" }}
            >
              <div className="flex items-center gap-2 text-[10px]">
                <p className="font-bold">Sort : </p>
                <p>{sortOptions}</p>
              </div>
              <SwapVertIcon />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-52 flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full mt-10">
          {filteredSurveys && filteredSurveys.length > 0 ? (
            <div className="grid grid-cols-4 gap-5">
              {filteredSurveys.map((s, index) => (
                <SurveyMeCard
                  key={index}
                  data={s}
                  onEdit={handleEdit}
                  onPublish={handlePublish}
                  onViewDetails={handleViewDetail}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-5">
              Không có khảo sát nào.
            </p>
          )}
        </div>
      )}
      {showPublishModal && (
        <PublishModal
          survey={selectedSurvey}
          open={showPublishModal}
          onClose={handleClosePublishModal}
          changeStatus={() => changeSurveyStatus(selectedSurvey?.Id || 0)}
        />
      )}
    </div>
  );
};

export default ManageSurveyPage;
