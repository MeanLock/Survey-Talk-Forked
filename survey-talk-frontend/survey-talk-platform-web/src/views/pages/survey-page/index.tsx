import { useEffect, useState, type FC } from "react";
import {
  Box,
  Paper,
  TableBody,
  Table as muiTable,
  TableContainer,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  AvatarGroup,
  Avatar,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import "./styles.scss";
import { Link } from "react-router-dom";
import LinkButton from "../../components/common/system/button/LinkButton";

interface SurveyPageProps {}

const SurveyPage: FC<SurveyPageProps> = () => {
  //STATES
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState(0);

  //FUNCTIONS
  const handleNext = () => {
    if (currentQuestions < totalQuestions) {
      const newCount = currentQuestions + 1;
      setCurrentQuestions(newCount);
    } else {
      setCurrentQuestions(0);
    }
  };
  return (
    <div className="w-full h-[100vh] flex flex-col items-center relative">
      <div className="survey-content w-full flex justify-center items-center h-[90%]">
        <Button variant="contained" onClick={() => handleNext()}>
          Next
        </Button>
      </div>
      <div className="survey-progress w-full h-[10%] flex flex-col items-center">
        <div className="survey-progress__count h-[90%] flex items-center justify-center">
          <p className="survey-progress__count-text">
            {currentQuestions} / {totalQuestions}
          </p>
        </div>
        <div className="survey-progress__bar w-full h-[10%] flex items-start">
          <div
            style={
              {
                "--progress-percent": `${
                  (currentQuestions / totalQuestions) * 100
                }%`,
              } as React.CSSProperties
            }
            className="survey-progress__bar-active h-full"
          ></div>
        </div>
      </div>
      <div className="!absolute top-4 right-4 z-10">
        <LinkButton
          link="/home"
          backgroundColor="red"
          color="white"
          title="Leave Survey Session"
        />
      </div>
    </div>
  );
};

export default SurveyPage;
