import type React from "react";
import type { SurveyCommunityCard } from "../../../core/types";
import { motion } from "framer-motion";
import { SurveyCard } from "./SurveyCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { Button, duration, IconButton } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  prefix: string;
  data: SurveyCommunityCard[] | null;
}

export const SurveysCarousel: React.FC<Props> = ({ prefix, data }) => {
  // STATES
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);

  const handleNext = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map((p) => (p + 4) % 5);
      return updatedIndexes;
    });
  };
  const handleBack = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map((p) => (p + 1) % 5);
      return updatedIndexes;
    });
  };

  const positions = ["left", "left1", "center", "right1", "right"];

  const cardVariants = {
    center: { x: "0%", scale: 1, zIndex: 5 },
    left1: { x: "-88%", scale: 0.7, zIndex: 3 },
    left: { x: "-150%", scale: 0.5, zIndex: 2 },
    right: { x: "150%", scale: 0.5, zIndex: 1 },
    right1: { x: "88%", scale: 0.7, zIndex: 3 },
  };

  return (
    <div className="w-full gap-2 flex justify-between items-center relative mt-[300px] mb-[200px]">
      <IconButton onClick={() => handleBack()}>
        <ArrowBackIosNewIcon />
      </IconButton>
      {data?.map((s, index) => (
        <motion.div
          key={index}
          initial="center"
          animate={positions[positionIndexes[index]]}
          variants={cardVariants}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", left: "38%" }}
        >
          <SurveyCard data={s} />
        </motion.div>
      ))}
      <IconButton onClick={() => handleNext()}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};
