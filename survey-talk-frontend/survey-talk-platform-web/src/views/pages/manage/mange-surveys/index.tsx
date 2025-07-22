import { useEffect, useState } from "react";
import type { SurveyTopic } from "../../../../core/types";
import { SurveyTopics } from "../../../../core/mockData/mockData";
import "./styles.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons từ Lucide React
import { Search, ArrowUpDown, Filter, Loader2 } from "lucide-react";

import { SurveyMeCard } from "./SurveyMeCard";
import { PublishModal } from "./components/PublishModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/rootReducer";
import { useGetMeSurveys } from "@/services/Survey/SurveyList/get-me-surveys";
import { useNavigate } from "react-router-dom";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { toast } from "react-toastify";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { confirmAlert } from "@/core/utils/alert.util";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Query = {
  Keyword: string | null;
  Deadline: string | null;
  Status: string | null;
};

type SortOption =
  | "created-newest"
  | "created-oldest"
  | "price-lowest"
  | "price-highest"
  | "taken-most"
  | "taken-least";

const ManageSurveyPage = () => {
  // REDUX FAKE NHỚ BỎ ĐI KHI ĐÃ CÓ API
  const user = useSelector((state: RootState) => state.auth.user);

  // STATES
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [surveys, setSurveys] = useState<any | null>(null);
  const [filteredSurveys, setFilteredSurveys] = useState<any | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [topics, setTopics] = useState<SurveyTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<SurveyTopic[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [query, setQuery] = useState<Query>({
    Keyword: null,
    Deadline: null,
    Status: null,
  });
  const [filterOption, setFilterOption] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("created-newest");
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  const {
    data: MeSurveysFromAPI,
    isLoading: isLoadingMeSurveys,
    isFetched,
  } = useGetMeSurveys({
    Keywords: query.Keyword,
    Deadline: query.Deadline,
    Status: query.Status,
  });

  // HOOKS
  const navigate = useNavigate();

  useEffect(() => {
    if (MeSurveysFromAPI) {
      console.log("Fetched Me Surveys:", MeSurveysFromAPI);
      setSurveys(MeSurveysFromAPI);
      setFilteredSurveys(MeSurveysFromAPI);
      setSelectedSurvey(null);
      setShowPublishModal(false);
      setTopics(SurveyTopics);
    }
  }, [MeSurveysFromAPI]);

  useEffect(() => {
    console.log("Query changed:", query);
  }, [query]);

  // Effect để filter theo topics và sort
  useEffect(() => {
    if (!surveys) return;

    let filtered = [...surveys];

    // Filter theo topics
    if (selectedTopics.length > 0) {
      const selectedTopicIds = selectedTopics.map((topic) => topic.id);
      filtered = filtered.filter((survey: any) =>
        selectedTopicIds.includes(survey.SurveyTopicId)
      );
    }

    // Sort theo option đã chọn
    filtered.sort((a: any, b: any) => {
      switch (sortOption) {
        case "created-newest":
          return (
            new Date(b.SurveyPrivateData?.CreatedAt || 0).getTime() -
            new Date(a.SurveyPrivateData?.CreatedAt || 0).getTime()
          );

        case "created-oldest":
          return (
            new Date(a.SurveyPrivateData?.CreatedAt || 0).getTime() -
            new Date(b.SurveyPrivateData?.CreatedAt || 0).getTime()
          );

        case "price-lowest":
          const priceA =
            (a.SurveyPrivateData?.TheoryPrice || 0) +
            (a.SurveyPrivateData?.ExtraPrice || 0);
          const priceB =
            (b.SurveyPrivateData?.TheoryPrice || 0) +
            (b.SurveyPrivateData?.ExtraPrice || 0);
          return priceA - priceB;

        case "price-highest":
          const priceA2 =
            (a.SurveyPrivateData?.TheoryPrice || 0) +
            (a.SurveyPrivateData?.ExtraPrice || 0);
          const priceB2 =
            (b.SurveyPrivateData?.TheoryPrice || 0) +
            (b.SurveyPrivateData?.ExtraPrice || 0);
          return priceB2 - priceA2;

        case "taken-most":
          return (
            (b.CurrentTakenResultCount || 0) - (a.CurrentTakenResultCount || 0)
          );

        case "taken-least":
          return (
            (a.CurrentTakenResultCount || 0) - (b.CurrentTakenResultCount || 0)
          );

        default:
          return 0;
      }
    });

    setFilteredSurveys(filtered);
  }, [selectedTopics, surveys, sortOption]);

  // FUNCTIONS
  const handleFilter = (value: string) => {
    setFilterOption(value);
    const newQuery = { ...query };

    switch (value) {
      case "All":
        newQuery.Status = null;
        newQuery.Deadline = null;
        break;
      case "Editing":
        newQuery.Status = "Editing";
        newQuery.Deadline = null;
        break;
      case "Published":
        newQuery.Status = "Published";
        newQuery.Deadline = null;
        break;
      case "OnDeadline":
        newQuery.Status = "Published";
        newQuery.Deadline = "OnDeadline";
        break;
      case "NearDeadline":
        newQuery.Status = "Published";
        newQuery.Deadline = "NearDeadline";
        break;
      case "LateForDeadline":
        newQuery.Status = "Completed";
        newQuery.Deadline = "LateForDeadline";
        break;
      case "Completed":
        newQuery.Status = "Completed";
        newQuery.Deadline = null;
        break;
      case "Deactivated":
        newQuery.Status = "Deactivated";
        newQuery.Deadline = null;
        break;
      default:
        newQuery.Status = null;
        newQuery.Deadline = null;
    }

    setQuery(newQuery);
    console.log("Updated query:", newQuery);
  };

  const handleFilterTopic = (checked: boolean, topicId: number) => {
    if (checked) {
      const topicToAdd = topics.find((t) => t.id === topicId);
      if (topicToAdd && !selectedTopics.some((t) => t.id === topicId)) {
        setSelectedTopics((prev) => [...prev, topicToAdd]);
      }
    } else {
      setSelectedTopics((prev) => prev.filter((t) => t.id !== topicId));
    }
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    const newQuery = {
      ...query,
      Keyword: keyword || null,
    };
    setQuery(newQuery);
    console.log("Tìm kiếm Survey với query:", newQuery);
    console.log("Keyword được gửi:", keyword);
  };

  const handleEdit = (id: number) => {
    navigate(`/survey/${id}/editing`);
  };

  const handleViewDetail = (id: number) => {
    navigate(`${id}/details`);
  };

  const handlePublish = (id: number) => {
    const survey = surveys?.filter((s: any) => s.Id === id)[0];
    setSelectedSurvey(survey);
    setShowPublishModal(true);
  };

  const handleClosePublishModal = () => {
    setShowPublishModal(false);
    setSelectedSurvey(null);
    navigate(0); // Refresh the page to reflect changes
  };

  const handleUnPublished = async (id: number) => {
    const response = await callAxiosRestApi({
      instance: loginRequiredAxiosInstance,
      method: "put",
      url: `Survey/core/community/surveys/${id}/unpublished`,
    });
    if (response && response.success) {
      toast.success("Hủy đăng khảo sát thành công");
      navigate(0);
    }
  };

  const handleDelete = async (id: number) => {
    const alert = await confirmAlert("Bạn có chắc muốn xóa khảo sát này?");
    console.log("Xóa khảo sát với ID:", alert);
    if (!alert.isConfirmed) return;
    const response = await callAxiosRestApi({
      instance: loginRequiredAxiosInstance,
      method: "delete",
      url: `Survey/core/surveys/${id}`,
    });
    if (response && response.success) {
      navigate(0);
      toast.success("Xóa khảo sát thành công");
    }
  };

  const changeSurveyStatus = (id: number) => {
    const updatedSurveys = surveys?.map((survey: any) =>
      survey.Id === id ? { ...survey, Status: 2 } : survey
    );
    setSurveys(updatedSurveys);
    setFilteredSurveys(updatedSurveys);
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "created-newest":
        return "Ngày tạo: Mới nhất";
      case "created-oldest":
        return "Ngày tạo: Cũ nhất";
      case "price-lowest":
        return "Giá đăng: Thấp nhất";
      case "price-highest":
        return "Giá đăng: Cao nhất";
      case "taken-most":
        return "Lượt làm: Nhiều nhất";
      case "taken-least":
        return "Lượt làm: Ít nhất";
      default:
        return "Ngày tạo: Mới nhất";
    }
  };

  return (
    <div className="surveys-me w-full flex flex-col items-start p-10">
      <p className="surveys-me__title mb-2">Tài liệu khảo sát của tôi</p>

      {/* Filter Radio Group với styling cải thiện */}
      {/* <div className="surveys-me__filter-container pl-3 pr-5 py-3 gap-5 flex items-center justify-around">
        <RadioGroup
          value={filterOption}
          onValueChange={handleFilter}
          className="flex flex-row gap-6 items-center  "
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="All" id="all" className="w-4 h-4" />
            <Label
              htmlFor="all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Editing" id="editing" className="w-4 h-4" />
            <Label
              htmlFor="editing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Đang chỉnh sửa
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="Published"
              id="published"
              className="w-4 h-4"
            />
            <Label
              htmlFor="published"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Đang Chạy
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="NearDeadline"
              id="neardeadline"
              className="w-4 h-4"
            />
            <Label
              htmlFor="neardeadline"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Near Deadline
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="OnDeadline"
              id="ondeadline"
              className="w-4 h-4"
            />
            <Label
              htmlFor="ondeadline"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              On Deadline
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="LateForDeadline"
              id="latefordeadline"
              className="w-4 h-4"
            />
            <Label
              htmlFor="latefordeadline"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Late For Deadline
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="Completed"
              id="completed"
              className="w-4 h-4"
            />
            <Label
              htmlFor="completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hoàn Thành
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="Deactivated"
              id="deactivated"
              className="w-4 h-4"
            />
            <Label
              htmlFor="deactivated"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Deactivated
            </Label>
          </div>
        </RadioGroup>
      </div> */}
      <div className="surveys-me__filter-container pl-3 pr-5 py-3 gap-5 flex items-center justify-around">
        <RadioGroup
          row
          value={filterOption}
          onChange={(e) => handleFilter(e.target.value)}
          className="flex flex-row gap-6 items-center"
        >
          <FormControlLabel
            value="All"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="All"
            className="text-sm"
          />
          <FormControlLabel
            value="Editing"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Đang chỉnh sửa"
            className="text-sm"
          />
          <FormControlLabel
            value="Published"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Đang Chạy"
            className="text-sm"
          />
          <FormControlLabel
            value="NearDeadline"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Near Deadline"
            className="text-sm"
          />
          <FormControlLabel
            value="OnDeadline"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="On Deadline"
            className="text-sm"
          />
          <FormControlLabel
            value="LateForDeadline"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Late For Deadline"
            className="text-sm"
          />
          <FormControlLabel
            value="Completed"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Hoàn Thành"
            className="text-sm"
          />
          <FormControlLabel
            value="Deactivated"
            control={
              <Radio
                sx={{ color: "#3E5DAB", "&.Mui-checked": { color: "#3E5DAB" } }}
                size="small"
              />
            }
            label="Deactivated"
            className="text-sm"
          />
        </RadioGroup>
      </div>

      {/* Search, Topic Filter, Sort */}
      <div className="surveys-me__search-topic-sort w-full grid grid-cols-12 my-7 gap-4">
        <div className="surveys-me__search col-span-8">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm khảo sát..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pr-10"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 !text-blue-600 !bg-transparent" />
            </Button>
          </div>
        </div>

        <div className="surveys-me__topic col-span-2 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Lọc theo chủ đề
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                Danh sách Chủ đề của khảo sát
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {topics?.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t.id}
                  checked={!!selectedTopics.find((topic) => topic.id === t.id)}
                  onCheckedChange={(checked) =>
                    handleFilterTopic(checked, t.id)
                  }
                >
                  {t.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="surveys-me__sort col-span-2 flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowUpDown className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold">Sort:</span>
                  <span className="text-xs">{getSortLabel(sortOption)}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <DropdownMenuRadioItem value="created-newest">
                  Ngày tạo: Mới nhất
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="created-oldest">
                  Ngày tạo: Cũ nhất
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-highest">
                  Giá đăng: Cao nhất
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-lowest">
                  Giá đăng: Thấp nhất
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="taken-most">
                  Lượt làm: Nhiều nhất
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="taken-least">
                  Lượt làm: Ít nhất
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading or Survey List */}
      {isLoadingMeSurveys ? (
        <div className="w-full h-52 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="w-full mt-10">
          {filteredSurveys && filteredSurveys.length > 0 ? (
            <div className="grid grid-cols-4 gap-5">
              {filteredSurveys.map((s: any, index: number) => (
                <SurveyMeCard
                  key={index}
                  data={s}
                  onEdit={handleEdit}
                  onPublish={handlePublish}
                  onViewDetails={handleViewDetail}
                  onUnPublish={handleUnPublished}
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

      {/* Publish Modal */}
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
