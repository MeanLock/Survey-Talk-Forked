"use client";

import type React from "react";
// import { Checkbox } from "@/components/ui/checkbox";
import Checkbox from "@mui/material/Checkbox";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

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
        onChangeValue("Không quan tâm");
      } else {
        onChangeValue("");
      }
    } else {
      if (checked) {
        const updatedValue = value.includes("Không quan tâm")
          ? option
          : value
          ? `${value
              .split(" | ")
              .filter((item) => item !== option)
              .join(" | ")} | ${option}`
          : option;
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

  const selectedOptions = value ? value.split(" | ").filter(Boolean) : [];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-lg text-[#3E5DAB] leading-relaxed">
          {question.question}
        </CardTitle>
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedOptions.map((option, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#3E5DAB]/10 text-[#3E5DAB] border border-[#3E5DAB]/20 px-2 py-1 text-xs"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {option}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 ${
                  value.includes(option)
                    ? "bg-[#3E5DAB]/5 border-[#3E5DAB]/30 "
                    : "border-gray-200"
                }`}
              >
                {/* <Checkbox
                  id={`option-${index}`}
                  checked={value.includes(option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option, checked as boolean)
                  }
                  className="w-5 h-5 rounded-md border border-gray-300 checked:bg-[#3E5DAB] checked:border-[#3E5DAB]"
                /> */}

                <Checkbox
                  checked={value.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(option, e.target.checked)
                  }
                  sx={{
                    color: "#3E5DAB",
                    "&.Mui-checked": {
                      color: "#3E5DAB",
                    },
                  }}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                    value.includes(option)
                      ? "text-[#3E5DAB] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
