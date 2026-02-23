import type { SurveyCreateUpdateType } from "@/core/types";
import useBlocker from "../../../../hooks/useBlocker";
import "./styles.scss";

import React from "react";
import SurveyNew from "../pages/SurveyNew";

interface Props {}

const SurveyCreatePage: React.FC<Props> = ({}) => {
  return (
    <div className="w-full flex flex-col h-screen">
      <SurveyNew />
    </div>
  );
};

export default SurveyCreatePage;
