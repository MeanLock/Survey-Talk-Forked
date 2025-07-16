"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Loader2,
  Calendar,
  DollarSign,
  Target,
  Filter,
  Users,
} from "lucide-react";
import { SegmentBasic } from "./SegmentBasic";
import { SegmentAge } from "./SegmentAge";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import type { SurveyType } from "@/core/types/tools";
import type { RootState } from "../../../../../redux/rootReducer";
import { callAxiosRestApi } from "../../../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../../../core/api/rest-api/config/instances/v2";
import { toast } from "react-toastify";
import { useRefetchUser } from "@/hooks/useRefetchUser";

interface Props {
  survey: SurveyType;
  open: boolean;
  onClose: () => void;
  changeStatus: () => void;
}

const segmentData = {
  sex: {
    question: "Giới tính của người làm?",
    options: ["Nam", "Nữ", "Không quan tâm"],
  },
  sexual: {
    question: "Xu hướng tính dục của người làm?",
    options: ["Dị giới", "Đồng giới", "Không quan tâm"],
  },
  job: {
    question:
      "Công việc đang làm/Ngành học của người làm khảo sát liên quan đến lĩnh vực nào?",
    options: [
      "Công nghệ thông tin & Trí tuệ nhân tạo",
      "Y tế & Chăm sóc sức khỏe",
      "Giáo dục & Đào tạo",
      "Kinh doanh, Marketing & Thương mại điện tử",
      "Kỹ thuật, Cơ điện & Tự động hóa",
      "Tài chính, Ngân hàng & Bảo hiểm",
      "Luật pháp, Hành chính & Chính phủ",
      "Nông nghiệp, Lâm nghiệp & Môi trường",
      "Nghệ thuật, Thiết kế & Truyền thông",
      "Dịch vụ, Du lịch & Khách sạn - Nhà hàng",
      "Xây dựng, Kiến trúc & Quy hoạch",
      "Logistics, Chuỗi cung ứng & Xuất nhập khẩu",
      "Nhân sự & Quản trị doanh nghiệp",
      "Tâm lý học, Xã hội học & Công tác xã hội",
      "Thể thao, Giải trí & Sự kiện",
      "Ngôn ngữ, Biên phiên dịch & Văn hóa",
      "Nghiên cứu, Khoa học & Phát triển công nghệ",
      "Bất động sản & Quản lý tài sản",
      "An ninh mạng & Viễn thông",
      "Toán học, Thống kê & Khoa học dữ liệu",
      "Không quan tâm",
    ],
  },
  educational: {
    question: "Trình độ học vấn của người làm khảo sát",
    options: [
      "Tiểu học",
      "Trung học cơ sở",
      "Trung học phổ thông",
      "Cao học (Cao đẳng, Học nghề)",
      "Đại học",
      "Sau Đại học",
      "Không quan tâm",
    ],
  },
  marriage: {
    question: "Tình trạng hôn nhân của người làm khảo sát?",
    options: [
      "Độc Thân",
      "Kết Hôn",
      "Ly Hôn (Ly dị, Ly thân)",
      "Góa",
      "Không quan tâm",
    ],
  },
  income: {
    question: "Thu nhập trung bình của người làm khảo sát?",
    options: [
      "< 3 triệu / tháng",
      "3 - 7 triệu/tháng",
      "7 - 15 triệu/tháng",
      "15 - 30 triệu/tháng",
      "> 30 triệu/tháng",
      "Không quan tâm",
    ],
  },
};

export const PublishModal: React.FC<Props> = ({
  survey,
  open,
  onClose,
  changeStatus,
}) => {
  // REDUX
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const refetchUser = useRefetchUser();
  // Loading states
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isKPILoading, setIsKPILoading] = useState(false);
  const [isDeadlineLoading, setIsDeadlineLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);

  // Existing states
  const [isDoneSegmentFilter, setIsDoneSegmentFilter] =
    useState<boolean>(false);
  const [segmentIndex, setSegmentIndex] = useState(1);
  const [isDonePromptFilter, setIsDonePromptFilter] = useState<boolean>(false);
  const [isKPIEntered, setIsKPIEntered] = useState<boolean>(false);
  const [isDeadlineEntered, setIsDeadlineEntered] = useState<boolean>(false);
  const [sex, setSex] = useState("");
  const [sexual, setSexual] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [education, setEducational] = useState("");
  const [marriage, setMarriage] = useState("");
  const [income, setIncome] = useState("");
  const [prompt, setPrompt] = useState("");
  const [accuracy, setAccuracy] = useState([80]);
  const [FilterTags, setFilterTags] = useState([]);
  const [suggestedKPI, setSuggestedKPI] = useState(-1);
  const [kpi, setKPI] = useState(0);
  const [errKPI, setErrKPI] = useState(false);
  const [errKPIMesg, setErrKPIMesg] = useState("");
  const [R, setR] = useState(0);
  const [minRangeDate, setMinRangeDate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errEndDate, setErrEndDate] = useState(false);
  const [errEndDateMsg, setErrEndDateMsg] = useState("");
  const [userPoint, setUserPoint] = useState(0);
  const [theoryPrice, setTheoryPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errPrice, setErrPrice] = useState(false);
  const [errPriceMsg, setErrPriceMsg] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện hành động !");
    }
    reset();
  }, []);

  useEffect(() => {
    if (
      sex !== "" &&
      sexual !== "" &&
      age !== "" &&
      job !== "" &&
      education !== "" &&
      marriage !== "" &&
      income !== ""
    ) {
      setIsDoneSegmentFilter(true);
    } else {
      setIsDoneSegmentFilter(false);
    }
  }, [sex, sexual, age, job, education, marriage, income]);

  useEffect(() => {
    if (prompt !== "") {
      setIsDonePromptFilter(true);
    } else {
      setIsDonePromptFilter(false);
    }
  }, [prompt]);

  const reset = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setIsDoneSegmentFilter(false);
    setSegmentIndex(1);
    setIsDonePromptFilter(false);
    setIsKPIEntered(false);
    setIsDeadlineEntered(false);
    setAge("");
    setSex("");
    setSexual("");
    setAge("");
    setAddress("");
    setJob("");
    setEducational("");
    setMarriage("");
    setIncome("");
    setPrompt("");
    setAccuracy([80]);
    setSuggestedKPI(-1);
    setKPI(0);
    setErrKPI(false);
    setErrKPIMesg("");
    setMinRangeDate(0);
    setStartDate(today);
    setEndDate("");
    setErrEndDate(false);
    setErrEndDateMsg("");
    setUserPoint(user?.Balance || 0); // Retrieve userPoint from Redux user balance
    setTheoryPrice(0);
    setTotalPrice(0);
    setErrPrice(false);
    setErrPriceMsg("");
  };

  const renderSegment = () => {
    switch (segmentIndex) {
      case 1:
        return (
          <SegmentAge value={age} onChangeValue={(newAge) => setAge(newAge)} />
        );
      case 2:
        return (
          <SegmentBasic
            value={sex}
            question={segmentData.sex}
            onChangeValue={(newSex) =>
              setSex(newSex === "Không quan tâm" ? "Không quan tâm" : newSex)
            }
          />
        );
      case 3:
        return (
          <SegmentBasic
            value={sexual}
            question={segmentData.sexual}
            onChangeValue={(newSexual) =>
              setSexual(
                newSexual === "Không quan tâm" ? "Không quan tâm" : newSexual
              )
            }
          />
        );
      case 4:
        return (
          <SegmentBasic
            value={job}
            question={segmentData.job}
            onChangeValue={(newJob) =>
              setJob(newJob === "Không quan tâm" ? "Không quan tâm" : newJob)
            }
          />
        );
      case 5:
        return (
          <SegmentBasic
            value={education}
            question={segmentData.educational}
            onChangeValue={(newEducation) =>
              setEducational(
                newEducation === "Không quan tâm"
                  ? "Không quan tâm"
                  : newEducation
              )
            }
          />
        );
      case 6:
        return (
          <SegmentBasic
            value={marriage}
            question={segmentData.marriage}
            onChangeValue={(newMarriage) =>
              setMarriage(
                newMarriage === "Không quan tâm"
                  ? "Không quan tâm"
                  : newMarriage
              )
            }
          />
        );
      case 7:
        return (
          <SegmentBasic
            value={income}
            question={segmentData.income}
            onChangeValue={(newIncome) =>
              setIncome(
                newIncome === "Không quan tâm" ? "Không quan tâm" : newIncome
              )
            }
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (segmentIndex === 7) {
      setIsDoneSegmentFilter(true);
    } else {
      setSegmentIndex(segmentIndex + 1);
    }
  };

  const handleBack = () => {
    if (segmentIndex > 1) {
      setSegmentIndex(segmentIndex - 1);
    }
  };

  const handleFilter = async () => {
    setIsFilterLoading(true);
    try {
      console.log("Filter response: ", prompt, accuracy, marriage, education);
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "post",
        url: `Survey/core/community/surveys/${survey.Id}/summary-filter-tag`,
        data: {
          SurveyTakerSegment: {
            CountryRegion: null, // Chưa làm
            MaritalStatus:
              marriage.trim() === "Không quan tâm" ? null : marriage,
            AverageIncome: income.trim() === "Không quan tâm" ? null : income,
            EducationLevel:
              education.trim() === "Không quan tâm" ? null : education,
            JobField: job.trim() === "Không quan tâm" ? null : job,
            Prompt: prompt,
            TagFilterAccuracyRate: accuracy[0],
          },
        },
      });

      if (response.success) {
        setSuggestedKPI(response.data.MaxKpi);
        setR(response.data.R);
        setFilterTags(response.data.FilterTags);
      }
    } catch (error) {
      console.log("Error while filtering: ", error);
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handleKPIChange = (value: string) => {
    if (suggestedKPI < Number(value)) {
      setErrKPI(true);
      setErrKPIMesg("KPI Thực tế không thể lớn hơn mức khuyến nghị!");
    } else {
      setErrKPI(false);
      setErrKPIMesg("");
    }
    setKPI(Number(value));
  };

  const handleEnterKPI = async () => {
    if (kpi <= 0 || R <= 0) {
      setErrKPI(true);
      setErrKPIMesg("KPI hoặc R không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }
    setIsKPILoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsKPIEntered(true);
      const minRange = Math.ceil(kpi / Number(R));
      setMinRangeDate(minRange);
      const calculatedEndDate = dayjs(startDate)
        .add(minRange, "day")
        .format("YYYY-MM-DD");
      setEndDate(calculatedEndDate);
    } finally {
      setIsKPILoading(false);
    }
  };

  const handleEndDateChange = (date: string) => {
    const startDatePlusMinRange = dayjs(startDate).add(minRangeDate, "day");
    const selectedEndDate = dayjs(date);
    if (selectedEndDate.isBefore(startDatePlusMinRange)) {
      setErrEndDate(true);
      setErrEndDateMsg(
        `Ngày Kết Thúc phải cách Ngày Bắt Đầu tối thiểu ${minRangeDate} ngày`
      );
    } else {
      setErrEndDate(false);
      setErrEndDateMsg("");
    }
    setEndDate(date);
  };

  const handleEnterDeadline = async () => {
    setIsDeadlineLoading(true);
    try {
      const startDateObj = dayjs(startDate);
      const endDateObj = dayjs(endDate);
      if (!endDate || endDateObj.isBefore(startDateObj)) {
        setErrEndDate(true);
        setErrEndDateMsg("Ngày kết thúc không hợp lệ. Vui lòng kiểm tra lại!");
        return;
      }
      const realRangeDate = endDateObj.diff(startDateObj, "day"); // Tính số ngày thực tế
      if (realRangeDate < minRangeDate) {
        setErrEndDate(true);
        setErrEndDateMsg(
          `Ngày kết thúc phải cách ngày bắt đầu tối thiểu ${minRangeDate} ngày.`
        );
        return;
      }
      const RS = realRangeDate / minRangeDate; // Tính tỷ lệ thời gian thực tế
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "post",
        url: `Survey/transaction/community/surveys/${survey.Id}/publish-price-calcular`,
        data: {
          Kpi: kpi,
          RS: RS,
        },
      });
      if (response.success) {
        const theoryPrice = response.data.TheoryPrice;
        setTheoryPrice(theoryPrice);
        setIsDeadlineEntered(true);
        setErrEndDate(false);
        setErrEndDateMsg("");
      }
    } catch (error) {
      console.error("Error while calculating deadline:", error);
      setErrEndDate(true);
      setErrEndDateMsg("Đã xảy ra lỗi khi tính toán deadline.");
    } finally {
      setIsDeadlineLoading(false);
    }
  };

  const handleTotalPriceChange = (value: string) => {
    if (theoryPrice > Number(value)) {
      setErrPrice(true);
      setErrPriceMsg(`Số tiền đăng tối thiểu là: ${formatVND(theoryPrice)}`);
    } else if (user?.Balance && Number(value) > user?.Balance) {
      setErrPrice(true);
      setErrPriceMsg(
        `Tài khoản của bạn đang có: ${user?.Balance} có vẻ không đủ, bạn có muốn nạp thêm ?`
      );
    } else {
      setErrPrice(false);
      setErrPriceMsg("");
    }
    setTotalPrice(Number(value));
  };

  const formatVND = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handlePublish = async () => {
    setIsPublishLoading(true);
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "post",
        url: `Survey/transaction/community/surveys/${survey.Id}/publish`,
        data: {
          Kpi: kpi,
          EndDate: endDate,
          FilterTags: FilterTags,
          SurveyTakerSegment: {
            CountryRegion: null, // Chưa làm
            MaritalStatus:
              marriage.trim() === "Không quan tâm" ? null : marriage,
            AverageIncome: income.trim() === "Không quan tâm" ? null : income,
            EducationLevel:
              education.trim() === "Không quan tâm" ? null : education,
            JobField: job.trim() === "Không quan tâm" ? null : job,
            Prompt: prompt,
            TagFilterAccuracyRate: accuracy[0],
          },
          ExtraPrice: totalPrice - theoryPrice,
          TheoryPrice: theoryPrice,
        },
      });
      if (response.success) {
        toast.success("Đăng khảo sát thành công!");
        await refetchUser();
        // Đóng modal
        onClose();
        changeStatus();
      }
      console.log("Hoàn thành đăng khảo sát!");
    } catch (error) {
      console.log("Error while publish survey: ", error);
    } finally {
      setIsPublishLoading(false);
    }
  };

  const checkData = () => {
    console.log("Giới Tính: ", sex);
    console.log("Xu hướng tính dục: ", sexual);
    console.log("Độ Tuổi: ", age);
    console.log("Prompt:", prompt);
    console.log("Accuracy: ", accuracy[0]);
    console.log("Income: ", income);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-w-none max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] shadow-2xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3E5DAB] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#3E5DAB]">
                Đăng Khảo Sát
              </DialogTitle>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Step 1: Segment Filter */}
          <Card className="border-l-4 border-l-[#3E5DAB] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#3E5DAB]/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#3E5DAB]">
                <Users className="w-5 h-5" />
                1. Nhập filter cứng của khảo sát (Accuracy 100%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                {renderSegment()}
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button
                  disabled={segmentIndex === 1}
                  onClick={handleBack}
                  variant="outline"
                  className="border-[#3E5DAB] text-[#3E5DAB] hover:bg-[#3E5DAB] hover:text-white bg-transparent"
                >
                  Quay lại
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Bước {segmentIndex}/7
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full ${
                          step <= segmentIndex ? "bg-[#3E5DAB]" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  disabled={(!age && segmentIndex === 1) || segmentIndex === 7}
                  onClick={handleNext}
                  variant="outline"
                  className="!border-[#3E5DAB] !text-[#3E5DAB] !hover:bg-[#3E5DAB] !hover:text-white !bg-transparent"
                >
                  {segmentIndex === 7 ? "Hoàn thành" : "Tiếp theo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Prompt Filter */}
          <Card className="border-l-4 border-l-[#FFC40D] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#FFC40D]/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#3E5DAB]">
                <Filter className="w-5 h-5" />
                2. Nhập filter prompt của khảo sát (Accuracy Max 80%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Filter</Label>
                <Textarea
                  id="prompt"
                  disabled={!isDoneSegmentFilter}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Nhập prompt filter của bạn..."
                  className="min-h-[100px] focus:ring-[#3E5DAB] focus:border-[#3E5DAB]"
                />
              </div>
              <div className="space-y-2">
                <Label>Accuracy: {accuracy[0]}%</Label>
                <Slider
                  disabled={!isDoneSegmentFilter}
                  value={accuracy}
                  onValueChange={setAccuracy}
                  max={80}
                  min={10}
                  step={10}
                  className="w-1/2"
                />
              </div>
              <Button
                disabled={
                  !isDoneSegmentFilter || !isDonePromptFilter || isFilterLoading
                }
                onClick={handleFilter}
                className="!bg-[#FFC40D] !hover:bg-[#FFC40D]/90 !text-black font-medium"
              >
                {isFilterLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang Filter...
                  </>
                ) : (
                  "Filter"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: KPI */}
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#3E5DAB]">
                <Target className="w-5 h-5" />
                3. Nhập KPI của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedKPI > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Gợi ý:</strong> Dựa vào tiêu chí filter của bạn,
                    chúng tôi gợi ý{" "}
                    <Badge
                      variant="secondary"
                      className="bg-[#3E5DAB] text-white"
                    >
                      {suggestedKPI}
                    </Badge>{" "}
                    là KPI tối đa mà bạn có thể set
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="kpi">KPI của bạn</Label>
                <Input
                  id="kpi"
                  disabled={suggestedKPI <= 0}
                  value={kpi}
                  type="number"
                  onChange={(e) => handleKPIChange(e.target.value)}
                  placeholder="Nhập KPI..."
                  className={`focus:ring-[#3E5DAB] focus:border-[#3E5DAB] ${
                    errKPI ? "border-red-500" : ""
                  }`}
                />
                {errKPI && <p className="text-red-500 text-sm">{errKPIMesg}</p>}
              </div>
              <Button
                disabled={suggestedKPI <= 0 || errKPI || isKPILoading}
                onClick={handleEnterKPI}
                className="!bg-green-600 !text-white !hover:bg-green-700"
              >
                {isKPILoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận KPI"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 4: Deadline */}
          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#3E5DAB]">
                <Calendar className="w-5 h-5" />
                4. Nhập Deadline của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isKPIEntered && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    <strong>Gợi ý:</strong> Dựa vào KPI của bạn, chúng tôi gợi ý
                    khoảng thời gian{" "}
                    <Badge
                      variant="secondary"
                      className="bg-orange-600 text-white"
                    >
                      TỐI THIỂU {minRangeDate} ngày
                    </Badge>
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    disabled={minRangeDate === 0}
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className={`focus:ring-[#3E5DAB] focus:border-[#3E5DAB] ${
                      errEndDate ? "border-red-500" : ""
                    }`}
                  />
                  {errEndDate && (
                    <p className="text-red-500 text-sm">{errEndDateMsg}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleEnterDeadline}
                disabled={errEndDate || endDate === "" || isDeadlineLoading}
                className="!bg-orange-600 !hover:bg-orange-700 !text-white"
              >
                {isDeadlineLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tính toán...
                  </>
                ) : (
                  "Xác nhận Deadline"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 5: Pricing */}
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#3E5DAB]">
                <DollarSign className="w-5 h-5" />
                5. Nhập Giá đăng Survey của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDeadlineEntered && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800">
                    <strong>Mức giá tối thiểu:</strong> Dựa vào tất cả các thông
                    tin của bạn, mức giá tối thiểu để đăng survey là{" "}
                    <Badge
                      variant="secondary"
                      className="bg-purple-600 text-white"
                    >
                      {formatVND(theoryPrice)}
                    </Badge>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Giá đăng (VND)</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  disabled={theoryPrice === 0}
                  value={totalPrice}
                  onChange={(e) => handleTotalPriceChange(e.target.value)}
                  placeholder="Nhập giá đăng..."
                  className={`focus:ring-[#3E5DAB] focus:border-[#3E5DAB] ${
                    errPrice ? "border-red-500" : ""
                  }`}
                />
                {errPrice && (
                  <p className="text-red-500 text-sm">{errPriceMsg}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Publish Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handlePublish}
              disabled={errPrice || isPublishLoading}
              size="lg"
              className="bg-gradient-to-r from-[#3E5DAB] to-[#3E5DAB]/80 hover:from-[#3E5DAB]/90 hover:to-[#3E5DAB]/70 text-white px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {isPublishLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang đăng khảo sát...
                </>
              ) : (
                "Đăng Khảo Sát"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
