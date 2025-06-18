import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Button,
  IconButton,
  TextField,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { Survey } from "../../../../../core/types";
import { SegmentBasic } from "./SegmentBasic";
import { SegmentAge } from "./SegmentAge";
import dayjs from "dayjs"; // Ensure dayjs is installed for date manipulation
import type { RootState } from "../../../../../redux/rootReducer";
import { updateAuthUser } from "../../../../../redux/auth/authSlice";
import { Balance } from "@mui/icons-material";

interface Props {
  survey: Survey;
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
      "Công nghệ thông tin",
      "Y tế",
      "Giáo dục",
      "Kinh doanh & Marketing",
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
    options: ["Độc thân", "Kết hôn", "Ly hôn", "Không quan tâm"],
  },
  income: {
    question: "Thu nhập trung bình của người làm khảo sát?",
    options: [
      "Dưới 3 triệu/tháng",
      "Từ 3 đến 7 triệu/tháng",
      "Từ 7 đến 15 triệu/tháng",
      "Từ 15 đến 30 triệu/tháng",
      "Trên 30 triệu/tháng",
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

  // STATES
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

  // Prompt Filter
  const [prompt, setPrompt] = useState("");
  const [accuracy, setAccuracy] = useState(80);

  // KPI
  const [suggestedKPI, setSuggestedKPI] = useState(-1);
  const [kpi, setKPI] = useState(0);
  const [errKPI, setErrKPI] = useState(false);
  const [errKPIMesg, setErrKPIMesg] = useState("");

  // Deadline
  const [minRangeDate, setMinRangeDate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errEndDate, setErrEndDate] = useState(false);
  const [errEndDateMsg, setErrEndDateMsg] = useState("");

  // Price
  const [userPoint, setUserPoint] = useState(0);
  const [theoryPrice, setTheoryPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errPrice, setErrPrice] = useState(false);
  const [errPriceMsg, setErrPriceMsg] = useState("");

  // HOOKS
  useEffect(() => {
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

  // FUNCTIONS
  // 1. Reset
  const reset = () => {
    const today = dayjs().format("YYYY-MM-DD"); // Format today's date as YYYY-MM-DD
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
    setAccuracy(80);

    setSuggestedKPI(-1);
    setKPI(0);
    setErrKPI(false);
    setErrKPIMesg("");

    setMinRangeDate(0);
    setStartDate(today); // Set startDate to today's date
    setEndDate("");
    setErrEndDate(false);
    setErrEndDateMsg("");

    setUserPoint(user?.balance || 0); // Retrieve userPoint from Redux user balance
    setTheoryPrice(0);
    setTotalPrice(0);
    setErrPrice(false);
    setErrPriceMsg("");
  };

  // 2. Render Segment
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

  // 3. Navigation (Next/Back)
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

  // 4. Filter
  const handleFilter = () => {
    console.log("Bắt đầu quá trình filter...");
    console.log("Filter với segment filter là:");
    console.log(
      `"Độ Tuổi": ${age} \n"Giới Tính": ${sex} \n"Xu Hướng Tính Dục": ${sexual} \n"Công Việc": ${job} \n"Trình Độ Học Vấn": ${education} \n"Tình Trạng Hôn Nhân": ${marriage} \n"Thu Nhập": ${income}`
    );
    console.log("Filter với prompt filter là:");
    console.log("Prompt: ", prompt);
    console.log("Accuracy: ", accuracy);
    setSuggestedKPI(100);
  };

  // 5. KPI
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

  const handleEnterKPI = () => {
    setIsKPIEntered(true);
    setMinRangeDate(15); // Example minimum range date
    const calculatedEndDate = dayjs(startDate)
      .add(15, "day")
      .format("YYYY-MM-DD"); // Calculate endDate based on minRangeDate
    setEndDate(calculatedEndDate); // Set endDate to the calculated minimum date
  };

  // 6. Deadline
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

  const handleEnterDeadline = () => {
    setIsDeadlineEntered(true);
    setTheoryPrice(10000);
  };

  // 7. Price
  const handleTotalPriceChange = (value: string) => {
    if (theoryPrice > Number(value)) {
      setErrPrice(true);
      setErrPriceMsg(`Số tiền đăng tối thiểu là: ${formatVND(theoryPrice)}`);
    } else if (Number(value) > user?.Balance) {
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

  // 8. Check Data
  const checkData = () => {
    console.log("Giới Tính: ", sex);
    console.log("Xu hướng tính dục: ", sexual);
    console.log("Độ Tuổi: ", age);
    console.log("Prompt:", prompt);
    console.log("Accuracy: ", accuracy);
    console.log("Income: ", income);
  };

  const handleAccuracyChange = (value: number) => {
    setAccuracy(value);
  };

  // 9. Handle Publish:
  const handlePublish = () => {
    // Logic xử lý khi hoàn thành
    dispatch(
      updateAuthUser({
        Balance: user?.Balance - totalPrice,
      })
    );
    console.log("Hoàn thành đăng khảo sát!");

    // Gọi hàm changeStatus để cập nhật statusId
    changeStatus();

    // Đóng modal
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-white shadow-lg rounded-lg p-6 overflow-y-scroll">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" component="h2">
            Đăng Khảo Sát
          </Typography>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mt-5 w-full flex flex-col gap-2">
          <p className="font-bold text-[#3e5dab]">
            1. Nhập filter cứng của khảo sát (Accurracy 100%)
          </p>
          {renderSegment()}
          <div className="flex justify-between mt-4">
            <Button
              disabled={segmentIndex === 1}
              onClick={handleBack}
              variant="contained"
              size="small"
            >
              Quay lại
            </Button>
            <Button
              disabled={(!age && segmentIndex === 1) || segmentIndex === 7}
              onClick={handleNext}
              variant="contained"
              size="small"
            >
              {segmentIndex === 7 ? "Hoàn thành" : "Tiếp theo"}
            </Button>
          </div>
        </div>

        <div className="mt-5 w-full flex flex-col gap-2">
          <p className="font-bold text-[#3e5dab]">
            2. Nhập filter prompt của khảo sát (Accurracy Max 80%)
          </p>
          <TextField
            disabled={!isDoneSegmentFilter}
            multiline
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Slider
            aria-label="Accuracy"
            disabled={!isDoneSegmentFilter}
            value={accuracy} // Ensure value is always defined
            onChange={(e, newValue) => handleAccuracyChange(newValue as number)}
            getAriaValueText={(value) => `${value}%`}
            valueLabelDisplay="auto"
            sx={{ width: "50%" }}
            step={10}
            marks
            min={10}
            max={80}
          />
          <Button
            disabled={!isDoneSegmentFilter && !isDonePromptFilter}
            onClick={() => handleFilter()}
            variant="contained"
            color="secondary"
            size="small"
          >
            Filter
          </Button>
        </div>

        <div className="mt-5 w-full flex flex-col gap-2">
          <p className="font-bold text-[#3e5dab]">3. Nhập KPI của bạn</p>
          {suggestedKPI > 0 && (
            <p className="mb-2">
              Dựa vào tiêu chí filter của bạn, chúng tôi gợi ý {suggestedKPI} là
              KPI tối đa mà bạn có thể set
            </p>
          )}
          <TextField
            disabled={suggestedKPI <= 0}
            value={kpi}
            label="KPI của bạn..."
            type="number"
            onChange={(e) => handleKPIChange(e.target.value)}
            error={errKPI}
            helperText={errKPIMesg}
          />
          <Button
            variant="contained"
            color="secondary"
            disabled={suggestedKPI <= 0 && !errKPI}
            onClick={() => handleEnterKPI()}
          >
            Xác nhận KPI
          </Button>
        </div>

        <div className="mt-5 w-full flex flex-col gap-2">
          <p className="font-bold text-[#3e5dab]">4. Nhập Deadline của bạn</p>
          {isKPIEntered && (
            <p>
              Dựa vào KPI của bạn, chúng tôi gợi ý khoảng thời gian TỐI THIỂU LÀ{" "}
              {minRangeDate} ngày
            </p>
          )}
          <TextField disabled type="date" value={startDate} />
          <TextField
            disabled={minRangeDate === 0}
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            error={errEndDate}
            helperText={errEndDateMsg}
          />
          <Button
            onClick={() => handleEnterDeadline()}
            disabled={errEndDate || endDate === ""}
            variant="contained"
            color="secondary"
          >
            Xác nhận Deadline
          </Button>
        </div>

        <div className="mt-5 w-full flex flex-col gap-2">
          <p className="font-bold text-[#3e5dab]">
            5. Nhập Giá đăng Survey của bạn
          </p>
          {isDeadlineEntered && (
            <p>
              Dựa vào tất cả các thông tin của bạn, mức giá tối thiểu để đăng
              survey là {formatVND(theoryPrice)}
            </p>
          )}
          <TextField
            type="number"
            disabled={theoryPrice === 0}
            value={totalPrice}
            error={errPrice}
            helperText={errPriceMsg}
            onChange={(e) => handleTotalPriceChange(e.target.value)}
          />
        </div>

        <Button
          onClick={() => handlePublish()}
          variant="contained"
          color="primary"
          disabled={errPrice}
        >
          Đăng Khảo Sát
        </Button>
      </div>
    </Modal>
  );
};
