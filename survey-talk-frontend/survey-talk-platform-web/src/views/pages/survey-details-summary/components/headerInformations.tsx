import { SurveySpecificTopics, SurveyTopics } from "@/core/mockData/mockData";

import FolderIcon from "@mui/icons-material/Folder";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import NetworkPingIcon from "@mui/icons-material/NetworkPing";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type SurveyTakenResult = {
  Id: number;
  IsValid: boolean;
  InvalidReason: string;
  MoneyEarned: number;
  XpEarned: number;
  CompletedAt: string;
  Taker: {
    Id: number;
    FullName: string;
    Dob: string;
    Gender: string;
    MainImageUrl: string;
  };
};

interface Props {
  topicId: number;
  specificTopicId: number;
  kpi: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  SurveyTakenResults: SurveyTakenResult[];
}

export const HeaderInformations: React.FC<Props> = ({
  topicId,
  specificTopicId,
  kpi,
  totalPrice,
  startDate,
  endDate,
  SurveyTakenResults,
}) => {
  const topics = SurveyTopics;
  const specificTopics = SurveySpecificTopics;

  const getTopicName = (id: number) => {
    const topic = topics.filter((t) => t.id === id)[0];
    if (topic) {
      return topic.name;
    } else {
      return "Không xác định";
    }
  };

  const getSpecificTopicName = (id: number) => {
    const speTopic = specificTopics.filter((t) => t.id === id)[0];
    if (speTopic) {
      return speTopic.name;
    } else {
      return "Không xác định";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex items-center justify-start gap-10">
        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#0AB2FB]/33">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">Chủ đề</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#0AB2FB] text-white flex justify-center items-center">
              <FolderIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">
            {getTopicName(topicId)}
          </p>
        </div>

        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#FFC40D]/25">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">Chủ đề cụ thể</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFC40D] text-white flex justify-center items-center">
              <FolderCopyIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">
            {getSpecificTopicName(specificTopicId)}
          </p>
        </div>

        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#7C18FF]/25">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">KPI</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#7C18FF] text-white flex justify-center items-center">
              <NetworkPingIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">{kpi}</p>
        </div>

        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#50A350]/35">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">Giá đăng Khảo Sát</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#50A350] text-white flex justify-center items-center">
              <FolderCopyIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">
            {totalPrice.toLocaleString("vn")} VND
          </p>
        </div>

        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#2DD8C7]/28">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">Ngày Đăng</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#2DD8C7] text-white flex justify-center items-center">
              <CalendarTodayIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="w-[153px] h-[65px] rounded-lg flex flex-col justify-between items-start p-2 bg-[#F87254]/37">
          <div className="w-full flex items-center justify-between">
            <p className="text-[12px]">Ngày Kết Thúc</p>
            <div className="w-[20px] h-[20px] rounded-full bg-[#F87254] text-white flex justify-center items-center">
              <CalendarTodayIcon sx={{ fontSize: "10px" }} />
            </div>
          </div>
          <p className="text-[15px] font-semibold truncate">
            {formatDate(endDate)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-1 flex items-center justify-center">
          <div className="w-full bg-white rounded-xl h-[331px] shadow-xl flex flex-col p-5 items-start justify-between">
            <div className="flex flex-col items-start justify-around ">
              <p className="text-[16px]">Total of Responses</p>
              <p className="text-[36px] font-bold">
                {SurveyTakenResults.length}
              </p>
            </div>

            <div className="h-40 bg-gray-200 w-full">Chart here</div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="w-full h-[331px] rounded-md bg-white shadow-xl">
            table
          </div>
        </div>
      </div>
    </div>
  );
};
