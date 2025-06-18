import type React from "react";

interface AvailableSurveyProps {}

const AvailableSurveys:React.FC<AvailableSurveyProps> = () => {
  return (
    <div className="w-full flex flex-col items-center p-10">
      <p>Danh sách các survey phù hợp với bạn</p>
    </div>
  );
};

export default AvailableSurveys;
