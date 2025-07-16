import type React from "react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Star } from "lucide-react";

type OptionDetails = {
  Id?: string | null;
  Content: string;
  Order: number;
  MainImageUrl: string;
  SurveyQuestionId: string;
};

type QuestionDetails = {
  Id?: string | null;
  SurveyId: string;
  MainImageUrl: string;
  QuestionTypeId: number;
  Content: string;
  Description: string;
  TimeLimit: number;
  IsVoice: boolean;
  Order: number;
  ConfigJsonString: string;
  DeletedAt: string | null;
  Options: OptionDetails[];
};

interface Props {
  questions: QuestionDetails[];
}

const RenderQuestion: React.FC<{ question: QuestionDetails }> = ({
  question,
}) => {
  const [singleSliderValue, setSingleSliderValue] = useState<number[]>([50]);
  const [rangeSliderValue, setRangeSliderValue] = useState<number[]>([1, 100]);

  const renderQuestionContent = () => {
    switch (question.QuestionTypeId) {
      case 1: // Single Choice
      case 2: // Multiple Choice
      case 7: // Ranking
        return (
          <div className="w-full flex flex-col items-start gap-3">
            <p className="text-gray-600 text-sm font-medium mb-2">Choices</p>
            {question.Options.map((option, idx) => (
              <div
                key={idx}
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-3 bg-white"
              >
                {option.MainImageUrl &&
                  !option.MainImageUrl.endsWith("unknown.jpg") && (
                    <img
                      src={
                        option.MainImageUrl ||
                        "/placeholder.svg?height=50&width=50"
                      }
                      alt={`Option ${option.Order}`}
                      className="w-[50px] h-[50px] object-cover rounded-md flex-shrink-0"
                    />
                  )}
                <p className="text-gray-800 truncate">{option.Content}</p>
              </div>
            ))}
          </div>
        );

      case 3: // Single Slider
        try {
          const config = JSON.parse(question.ConfigJsonString);
          const min = config.Min || 0;
          const max = config.Max || 100;
          const step = config.Step || 1;
          const unit = config.Unit || "";

          // Set initial value to middle
          const initialValue = Math.floor((min + max) / 2);
          if (singleSliderValue[0] === 50) {
            setSingleSliderValue([initialValue]);
          }

          return (
            <div className="w-full flex flex-col items-start gap-3">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Slider (VND)
              </p>
              <div className="w-full max-w-2xl px-6 py-6 border border-gray-300 rounded-lg bg-white">
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>{min.toLocaleString()}</span>
                  <span>{max.toLocaleString()}</span>
                </div>
                <Slider
                  value={singleSliderValue}
                  min={min}
                  max={max}
                  step={step}
                  onValueChange={setSingleSliderValue}
                  disabled
                  className="w-full"
                />
                <div className="mt-4 text-center">
                  <span className="text-lg font-medium text-gray-800">
                    {singleSliderValue[0].toLocaleString()} {unit}
                  </span>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          return (
            <div className="text-red-500">
              Error parsing slider configuration
            </div>
          );
        }

      case 4: // Range Slider
        try {
          const config = JSON.parse(question.ConfigJsonString);
          const min = config.Min || 0;
          const max = config.Max || 100;
          const step = config.Step || 1;
          const unit = config.Unit || "";

          return (
            <div className="w-full flex flex-col items-start gap-3">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Range Slider
              </p>
              <div className="w-full max-w-2xl px-6 py-6 border border-gray-300 rounded-lg bg-white">
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>{min.toLocaleString()}</span>
                  <span>{max.toLocaleString()}</span>
                </div>
                <Slider
                  value={[min, max]}
                  min={min}
                  max={max}
                  step={step}
                  onValueChange={setRangeSliderValue}
                  disabled
                  className="w-full"
                />
                <div className="mt-4 flex justify-between">
                  <span className="font-medium text-gray-800">
                    {min.toLocaleString()} {unit}
                  </span>
                  <span className="font-medium text-gray-800">
                    {max.toLocaleString()} {unit}
                  </span>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          return (
            <div className="text-red-500">
              Error parsing range slider configuration
            </div>
          );
        }

      case 5: // Form Input
        return (
          <div className="w-full flex flex-col items-start gap-3">
            <p className="text-gray-600 text-sm font-medium mb-2">Text Input</p>
            <Textarea
              className="w-full max-w-2xl min-h-[120px] resize-none border-gray-300 rounded-lg"
              placeholder="Nhập câu trả lời của bạn..."
              disabled
            />
          </div>
        );

      case 6: // Rating
        try {
          const config = JSON.parse(question.ConfigJsonString);
          const ratingLength = config.RatingLength || 5;
          const ratingIcon = config.RatingIcon || "Star";

          return (
            <div className="w-full flex flex-col items-start gap-3">
              <p className="text-gray-600 text-sm font-medium mb-2">Rating</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: ratingLength }).map((_, idx) => (
                  <div
                    key={idx}
                    className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                  >
                    {ratingIcon === "FavoriteIcon" ? (
                      <Heart className="w-8 h-8" />
                    ) : (
                      <Star className="w-8 h-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        } catch (error) {
          return (
            <div className="text-red-500">
              Error parsing rating configuration
            </div>
          );
        }

      default:
        return (
          <div className="text-gray-500 italic">Unsupported question type</div>
        );
    }
  };

  return <div className="w-full">{renderQuestionContent()}</div>;
};

export const QuestionPreview: React.FC<Props> = ({ questions }) => {
  // Filter ra các câu hỏi chưa bị xóa và sort theo Order
  const filteredAndSortedQuestions = questions
    .filter((q: QuestionDetails) => q.DeletedAt === null)
    .sort((a: QuestionDetails, b: QuestionDetails) => a.Order - b.Order);

  if (filteredAndSortedQuestions.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500 text-lg">
          Không có câu hỏi nào để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {filteredAndSortedQuestions.map((q: QuestionDetails, index: number) => (
        <div key={index} className="w-full flex flex-col mb-8">
          {/* Question Header */}
          <div className="bg-[#a8b3d9] flex items-center px-4 py-4 text-gray-700 font-medium">
            Question {q.Order}
          </div>

          {/* Question Content */}
          <div className="w-full bg-gray-50 px-6 py-8 flex flex-col items-start gap-6">
            {/* Question Text */}
            <div className="w-full flex flex-col gap-2 items-start">
              <p className="text-gray-600 text-sm font-medium">Question</p>
              <div className="w-full flex flex-col items-start px-4 py-3 border border-gray-300 rounded-lg bg-white">
                <p className="text-gray-800">{q.Content}</p>
              </div>
            </div>

            {/* Question Description */}
            <div className="w-full flex flex-col items-start gap-2">
              <p className="text-gray-600 text-sm font-medium">Description</p>
              <div className="w-full flex flex-col items-start px-4 py-3 border border-gray-300 rounded-lg bg-white min-h-[48px]">
                {q.Description ? (
                  <p className="text-gray-700">{q.Description}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    Câu hỏi không có miêu tả.
                  </p>
                )}
              </div>
            </div>

            {/* Question Type Specific Content */}
            <RenderQuestion question={q} />
          </div>
        </div>
      ))}
    </div>
  );
};
