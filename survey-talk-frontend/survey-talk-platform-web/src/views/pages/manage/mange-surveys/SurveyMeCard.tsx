import type React from "react";
import type { Survey } from "../../../../core/types";
import { SurveyStatuses } from "../../../../core/mockData/mockData";

// ICONS
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PublishIcon from "@mui/icons-material/Publish";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { Tooltip } from "@mui/material";
interface Props {
  data: Survey;
  onEdit: (id: number) => void;
  onViewDetails: (id: number) => void;
  onPublish: (id: number) => void;
  onUnPublish: (id: number) => void;
  onDelete: (id: number) => void;
}

export const SurveyMeCard: React.FC<Props> = ({
  data,
  onEdit,
  onViewDetails,
  onPublish,
  onUnPublish,
  onDelete,
}) => {
  // FUNCTIONS
  const countTakenResult = (survey: Survey): string => {
    console.log("Survey: ", survey);
    if (survey.SurveyStatusId !== 2) {
      return "Khảo sát chưa đăng";
    }
    const count = survey.CurrentTakenResultCount;
    if (count > 0) {
      return count + "/" + survey.SurveyPrivateData.Kpi + " lượt làm";
    } else {
      return "Chưa có người làm";
    }
  };

  const renderStatus = (statusId: number) => {
    if (statusId === 1) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-indigo-400 rounded-full "></div>
          <p className="font-bold text-gray-400">Editing</p>
        </div>
      );
    } else if (statusId === 2) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full "></div>
          <p className="font-bold text-gray-400">Publish</p>
        </div>
      );
    } else if (statusId === 3) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#50A350] rounded-full "></div>
          <p className="font-bold text-gray-400">Completed</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full "></div>
          <p className="font-bold text-gray-400">Deactivated</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[276px] flex flex-col relative group">
        <img
          src={data.MainImageUrl}
          alt={data.Title}
          className="w-[276px] h-[112px] object-cover rounded-lg shadow-lg group-hover:brightness-75 transition duration-300"
        />
        <div className="w-[276px] h-[112px] absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
          <Tooltip title="Sửa khảo sát" arrow placement="top">
            <IconButton
              onClick={() => onEdit(data.Id)}
              aria-label="Edit"
              sx={{ color: "white" }}
              className="bg-white rounded-full shadow-md hover:bg-gray-200"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xem khảo sát" arrow placement="top">
            <IconButton
              onClick={() => onViewDetails(data.Id)}
              aria-label="View Details"
              sx={{ color: "white" }}
              className="bg-white rounded-full shadow-md hover:bg-gray-200"
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>

          {data.SurveyStatusId === 1 && (
            <>
              <Tooltip title="Đăng khảo sát" arrow placement="top">
                <IconButton
                  onClick={() => onPublish(data.Id)}
                  aria-label="Publish"
                  sx={{ color: "white" }}
                  className="bg-white rounded-full shadow-md hover:bg-gray-200"
                >
                  <PublishIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Xóa khảo sát" arrow placement="top">
                <IconButton
                  onClick={() => onDelete(data.Id)}
                  aria-label="Delete"
                  sx={{ color: "white" }}
                  className="bg-white rounded-full shadow-md hover:bg-gray-200"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {data.SurveyStatusId === 2 && (
            <Tooltip title="Hủy đăng khảo sát" arrow placement="top">
              <IconButton
                onClick={() => onUnPublish(data.Id)}
                aria-label="Unpublish"
                sx={{ color: "white" }}
                className="bg-white rounded-full shadow-md hover:bg-gray-200"
              >
                <UnpublishedIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className="w-full flex items-center justify-start">
          <p className="font-bold text-[#3e5dab] truncate">{data.Title}</p>
        </div>
        <div className="w-full flex items-center justify-start gap-5">
          <p className="text-sm text-gray-400">{countTakenResult(data)}</p>
          <p>{renderStatus(data.SurveyStatusId)}</p>
        </div>
      </div>
    </div>
  );
};
