import React from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

interface Props {
  value: string;
  question: {
    question: string;
    options: string[];
  };
  onChangeValue: (value: string) => void;
}

export const SegmentBasic: React.FC<Props> = ({
  value,
  question,
  onChangeValue,
}) => {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (option === "Không quan tâm") {
      if (checked) {
        onChangeValue("Không quan tâm"); // Reset state when "Không quan tâm" is selected
      } else {
        onChangeValue(""); // Clear "Không quan tâm" if unchecked
      }
    } else {
      if (checked) {
        const updatedValue = value.includes("Không quan tâm")
          ? option // Replace "Không quan tâm" with the new option
          : value
          ? `${value
              .split(" | ")
              .filter((item) => item !== option)
              .join(" | ")} | ${option}`
          : option; // Avoid adding leading ". " for empty initial state
        onChangeValue(updatedValue);
      } else {
        const updatedValue = value
          .split(" | ")
          .filter((item) => item !== option)
          .join(" | ");
        onChangeValue(updatedValue);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 h-[134px] overflow-y-scroll">
      <Typography variant="h6">{question.question}</Typography>
      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={value.includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              />
            }
            label={option}
          />
        ))}
      </div>
    </div>
  );
};
