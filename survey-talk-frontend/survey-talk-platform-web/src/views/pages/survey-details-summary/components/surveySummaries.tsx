import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type Question = {
  Id: string;
  SurveyId: number;
  QuestionTypeId: number;
  Content: string;
  Description: string;
  Order: number;
  ConfigJsonString: string;
  DeletedAt: string | null;
  MainImageUrl: string;
  Options: {
    Id: number;
    SurveyQuestionId: number;
    Content: string;
    Order: number;
    MainImageUrl: string;
  }[];
};

type Response = {
  Id: number;
  SurveyTakenResultId: number;
  SurveyQuestionId: string;
  IsValid: boolean;
  ValueJsonString: string;
};

type QuestionResponseSummaryList = {
  Questions: Question[];
  Responses: Response[];
};

// Processed data types
type ChoiceQuestion = {
  content: string;
  totalResponses: number;
  options: { content: string; count: number }[];
};

type SliderQuestion = {
  content: string;
  totalResponses: number;
  responses: { value: number; count: number }[];
  unit?: string;
};

type TextQuestion = {
  content: string;
  totalResponses: number;
  responses: { value: string }[];
};

type RatingQuestion = {
  content: string;
  totalResponses: number;
  ratings: { value: number; count: number; percentage: number }[];
};

type RankingQuestion = {
  content: string;
  totalResponses: number;
  optionCount: number;
  totalPoint: number;
  options: {
    optionContent: string;
    optionPoint: number;
    rank: number;
    percentage: number;
  }[];
};

interface Props {
  summaryLists: QuestionResponseSummaryList[];
}

const COLORS = [
  "#FFBB28",
  "#4F81BD",
  "#00C49F",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

export const ResponseSummaries: React.FC<Props> = ({ summaryLists }) => {
  const [preparedData, setPreparedData] = useState<any[]>([]);

  useEffect(() => {
    if (summaryLists && summaryLists.length > 0) {
      const processedData = mappingQuestion(summaryLists);
      setPreparedData(processedData);
    }
  }, [summaryLists]);

  const mappingQuestion = (summary: QuestionResponseSummaryList[]) => {
    const processedQuestions: any[] = [];

    // Get all unique questions by content
    const uniqueQuestions = new Map<string, Question>();
    summary.forEach((item) => {
      item.Questions.forEach((question) => {
        if (!uniqueQuestions.has(question.Content)) {
          uniqueQuestions.set(question.Content, question);
        }
      });
    });

    // Process each unique question
    uniqueQuestions.forEach((question, questionContent) => {
      // Collect all responses for this question across all summary lists
      const allResponses: Response[] = [];
      summary.forEach((item) => {
        const questionResponses = item.Responses.filter((response) => {
          const matchingQuestion = item.Questions.find(
            (q) => q.Id === response.SurveyQuestionId
          );
          return (
            matchingQuestion && matchingQuestion.Content === questionContent
          );
        });
        allResponses.push(...questionResponses);
      });

      const validResponses = allResponses.filter((r) => r.IsValid);

      switch (question.QuestionTypeId) {
        case 1: // Single Choice
        case 2: // Multiple Choice
          processedQuestions.push(
            processChoiceQuestion(question, validResponses)
          );
          break;
        case 3: // Single Slider
        case 4: // Range Slider
          processedQuestions.push(
            processSliderQuestion(question, validResponses)
          );
          break;
        case 5: // Text Input
          processedQuestions.push(
            processTextQuestion(question, validResponses)
          );
          break;
        case 6: // Rating
          processedQuestions.push(
            processRatingQuestion(question, validResponses)
          );
          break;
        case 7: // Ranking
          processedQuestions.push(
            processRankingQuestion(question, validResponses)
          );
          break;
      }
    });

    return processedQuestions.sort((a, b) => a.order - b.order);
  };

  const processChoiceQuestion = (
    question: Question,
    responses: Response[]
  ): ChoiceQuestion & { type: number; order: number } => {
    const optionCounts = new Map<string, number>();

    // Create a map of option IDs to their content for this question
    const optionIdToContent = new Map<string, string>();

    // First, we need to get all options from all summary lists for this question
    // Since the question.Options might be empty, we need to extract options from responses
    const allOptionsFromResponses = new Set<string>();

    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionContent = parsed.QuestionContent;

        if (
          questionContent &&
          questionContent.Options &&
          Array.isArray(questionContent.Options)
        ) {
          questionContent.Options.forEach((option: any) => {
            if (option.Id && option.Content) {
              optionIdToContent.set(option.Id.toString(), option.Content);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing response for options:", error);
      }
    });

    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionResponse = parsed.QuestionResponse;

        if (question.QuestionTypeId === 1 && questionResponse.SingleChoice) {
          // Single choice - map ID to content
          const choiceId = questionResponse.SingleChoice;
          const choiceContent = optionIdToContent.get(choiceId) || choiceId;
          optionCounts.set(
            choiceContent,
            (optionCounts.get(choiceContent) || 0) + 1
          );
        } else if (
          question.QuestionTypeId === 2 &&
          questionResponse.MultipleChoice
        ) {
          // Multiple choice - could be array of choice IDs
          const choices = Array.isArray(questionResponse.MultipleChoice)
            ? questionResponse.MultipleChoice
            : [questionResponse.MultipleChoice];

          choices.forEach((choiceId: string) => {
            const choiceContent = optionIdToContent.get(choiceId) || choiceId;
            optionCounts.set(
              choiceContent,
              (optionCounts.get(choiceContent) || 0) + 1
            );
          });
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });

    const options = Array.from(optionCounts.entries()).map(
      ([content, count]) => ({
        content,
        count,
      })
    );

    return {
      content: question.Content,
      totalResponses: responses.length,
      options,
      type: question.QuestionTypeId,
      order: question.Order,
    };
  };

  //   const processSliderQuestion = (
  //     question: Question,
  //     responses: Response[]
  //   ): SliderQuestion & { type: number; order: number; unit: string } => {
  //     const valueCounts = new Map<number, number>();

  //     // Extract unit from ConfigJsonString
  //     let unit = "";
  //     try {
  //       const config = JSON.parse(question.ConfigJsonString);
  //       unit = config.Unit || "";
  //     } catch (error) {
  //       console.error("Error parsing config:", error);
  //     }

  //     // DEBUG
  //     responses.forEach((response) => {
  //       try {
  //         const parsed = JSON.parse(response.ValueJsonString);
  //         const questionResponse = parsed.QuestionResponse;

  //         console.log("Slider - Raw response:", parsed);

  //         if (question.QuestionTypeId === 3) {
  //           console.log("Type 3 - Input:", questionResponse?.Input);
  //         }

  //         if (question.QuestionTypeId === 4) {
  //           console.log("Type 4 - Range:", questionResponse?.Range);
  //         }
  //       } catch (error) {
  //         console.error("Error parsing response:", error);
  //       }
  //     });

  //     responses.forEach((response) => {
  //       try {
  //         const parsed = JSON.parse(response.ValueJsonString);
  //         const questionResponse = parsed.QuestionResponse;

  //         if (question.QuestionTypeId === 3 && questionResponse.Input) {
  //           // Single slider
  //           const input = questionResponse?.Input ?? parsed?.Value ?? null;
  //           const value = Number.parseFloat(input);
  //           if (!isNaN(value)) {
  //             valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  //           }
  //         } else if (question.QuestionTypeId === 4 && questionResponse.Range) {
  //           // Range slider - we'll use the average of min and max
  //           const { Min, Max } = questionResponse.Range;
  //           if (Min !== null && Max !== null) {
  //             const avgValue = (Min + Max) / 2;
  //             valueCounts.set(avgValue, (valueCounts.get(avgValue) || 0) + 1);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error parsing response:", error);
  //       }
  //     });

  //     const responseData = Array.from(valueCounts.entries())
  //       .map(([value, count]) => ({ value, count }))
  //       .sort((a, b) => a.value - b.value);

  //     return {
  //       content: question.Content,
  //       totalResponses: responses.length,
  //       responses: responseData,
  //       type: question.QuestionTypeId,
  //       order: question.Order,
  //       unit: unit,
  //     };
  //   };

  const processSliderQuestion = (
    question: Question,
    responses: Response[]
  ): SliderQuestion & { type: number; order: number; unit: string } => {
    const valueCounts = new Map<number, number>();

    let unit = "";
    try {
      const config = JSON.parse(question.ConfigJsonString);
      unit = config.Unit || "";
    } catch (error) {
      console.error("Error parsing config:", error);
    }

    responses.forEach((response) => {
      try {
        console.log("🔥 Raw ValueJsonString:", response.ValueJsonString);

        const parsed = JSON.parse(response.ValueJsonString);
        console.log("🔥 Parsed value:", parsed);

        const questionResponse = parsed.QuestionResponse;

        if (question.QuestionTypeId === 3) {
          const input = questionResponse?.Input;

          let rawValue: any = null;

          if (input && typeof input === "object") {
            if ("ObjectValue" in input) {
              rawValue = input.ObjectValue;
            } else if ("Value" in input) {
              rawValue = input.Value;
            }
          } else if (typeof input === "number" || typeof input === "string") {
            rawValue = input;
          }

          console.log("✅ Slider input value (raw):", rawValue);

          const value = Number.parseFloat(rawValue);
          if (!isNaN(value)) {
            valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
          } else {
            console.warn("⚠️ Value is NaN:", rawValue);
          }
        } else if (question.QuestionTypeId === 4 && questionResponse?.Range) {
          const { Min, Max } = questionResponse.Range;
          if (Min != null && Max != null) {
            const avgValue = (Min + Max) / 2;
            valueCounts.set(avgValue, (valueCounts.get(avgValue) || 0) + 1);
          }
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });

    const responseData = Array.from(valueCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value - b.value);

    return {
      content: question.Content,
      totalResponses: responses.length,
      responses: responseData,
      type: question.QuestionTypeId,
      order: question.Order,
      unit,
    };
  };

  const processTextQuestion = (
    question: Question,
    responses: Response[]
  ): TextQuestion & { type: number; order: number } => {
    const textResponses: { value: string }[] = [];

    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionResponse = parsed.QuestionResponse;

        if (questionResponse.Input) {
          const value = questionResponse.Input;
          textResponses.push({
            value: typeof value === "string" ? value : JSON.stringify(value),
          });
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });

    return {
      content: question.Content,
      totalResponses: responses.length,
      responses: textResponses,
      type: question.QuestionTypeId,
      order: question.Order,
    };
  };

  //   const processRatingQuestion = (
  //     question: Question,
  //     responses: Response[]
  //   ): RatingQuestion & { type: number; order: number } => {
  //     const ratingCounts = new Map<number, number>();

  //     responses.forEach((response) => {
  //       try {
  //         const parsed = JSON.parse(response.ValueJsonString);
  //         console.log("🔍 Raw Rating ValueJsonString:", parsed);
  //       } catch (error) {
  //         console.error("❌ Error parsing rating response:", error);
  //       }
  //     });

  //     responses.forEach((response) => {
  //       try {
  //         const parsed = JSON.parse(response.ValueJsonString);
  //         const questionResponse = parsed.QuestionResponse;

  //         if (questionResponse.Input) {
  //           const rating = Number.parseInt(questionResponse.Input);
  //           if (!isNaN(rating)) {
  //             ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error parsing response:", error);
  //       }
  //     });

  //     const totalResponses = responses.length;
  //     const ratings = Array.from(ratingCounts.entries())
  //       .map(([value, count]) => ({
  //         value,
  //         count,
  //         percentage: Math.round((count / totalResponses) * 100),
  //       }))
  //       .sort((a, b) => a.value - b.value);

  //     return {
  //       content: question.Content,
  //       totalResponses: responses.length,
  //       ratings,
  //       type: question.QuestionTypeId,
  //       order: question.Order,
  //     };
  //   };

  const processRatingQuestion = (
    question: Question,
    responses: Response[]
  ): RatingQuestion & { type: number; order: number } => {
    const ratingCounts = new Map<number, number>();

    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionResponse = parsed.QuestionResponse;

        let rawValue: any = null;
        const input = questionResponse?.Input;

        if (typeof input === "object" && input !== null) {
          // Gọi là Value thay vì ObjectValue như Slider
          rawValue = input.Value ?? input.ObjectValue ?? null;
        } else {
          rawValue = input;
        }

        const rating = Number.parseInt(rawValue);
        if (!isNaN(rating)) {
          ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
        } else {
          console.warn("⚠️ Rating value is NaN:", rawValue);
        }
      } catch (error) {
        console.error("❌ Error parsing rating response:", error);
      }
    });

    const totalResponses = responses.length;
    const ratings = Array.from(ratingCounts.entries())
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / totalResponses) * 100),
      }))
      .sort((a, b) => a.value - b.value);

    return {
      content: question.Content,
      totalResponses,
      ratings,
      type: question.QuestionTypeId,
      order: question.Order,
    };
  };

  const processRankingQuestion = (
    question: Question,
    responses: Response[]
  ): RankingQuestion & { type: number; order: number } => {
    const optionPoints = new Map<string, number>();
    const optionCounts = new Map<string, number>();

    // Create a map of option IDs to their content
    const optionIdToContent = new Map<string, string>();

    // Get option mapping from responses
    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionContent = parsed.QuestionContent;

        if (
          questionContent &&
          questionContent.Options &&
          Array.isArray(questionContent.Options)
        ) {
          questionContent.Options.forEach((option: any) => {
            if (option.Id && option.Content) {
              optionIdToContent.set(option.Id.toString(), option.Content);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing response for options:", error);
      }
    });

    let optionCount = 0;

    responses.forEach((response) => {
      try {
        const parsed = JSON.parse(response.ValueJsonString);
        const questionResponse = parsed.QuestionResponse;

        if (
          questionResponse.Ranking &&
          Array.isArray(questionResponse.Ranking)
        ) {
          optionCount = Math.max(optionCount, questionResponse.Ranking.length);

          questionResponse.Ranking.forEach((rankItem: any) => {
            const optionId = rankItem.SurveyOptionId;
            const optionContent = optionIdToContent.get(optionId) || optionId;
            const rankIndex = rankItem.RankIndex;

            if (optionContent && rankIndex !== undefined) {
              // Points = optionCount - rankIndex + 1 (rank 1 gets max points)
              const points = optionCount - rankIndex + 1;
              optionPoints.set(
                optionContent,
                (optionPoints.get(optionContent) || 0) + points
              );
              optionCounts.set(
                optionContent,
                (optionCounts.get(optionContent) || 0) + 1
              );
            }
          });
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });

    const totalPoint = responses.length * optionCount;

    // Create options array with points and ranks
    const options = Array.from(optionPoints.entries())
      .map(([optionContent, optionPoint]) => ({
        optionContent,
        optionPoint,
        rank: 0, // Will be set below
        percentage: Math.round((optionPoint / totalPoint) * 100),
      }))
      .sort((a, b) => b.optionPoint - a.optionPoint) // Sort by points descending
      .map((option, index) => ({
        ...option,
        rank: index + 1,
      }));

    return {
      content: question.Content,
      totalResponses: responses.length,
      optionCount,
      totalPoint,
      options,
      type: question.QuestionTypeId,
      order: question.Order,
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">{`Số lượng: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = (questionData: any) => {
    switch (questionData.type) {
      case 1:
      case 2:
        // Horizontal Bar Chart for Choice Questions
        return (
          <div className="space-y-4">
            {questionData.options.map((option: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-right truncate">
                  {option.content}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full flex items-center justify-start pl-2"
                      style={{
                        width: `${Math.max(
                          (option.count / questionData.totalResponses) * 100,
                          10
                        )}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {Math.round(
                          (option.count / questionData.totalResponses) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {option.count} phiếu
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
      case 4:
        // Line Chart for Slider Questions
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={questionData.responses}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="value"
                tickFormatter={(value) => {
                  const unit = questionData.unit || "";
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(0)}M ${unit}`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K ${unit}`;
                  }
                  return `${value} ${unit}`;
                }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F81BD"
                strokeWidth={3}
                dot={{ fill: "#4F81BD", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 5:
        // Text responses display
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {questionData.responses
              .slice(0, 10)
              .map((response: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-start"
                >
                  <p className="text-sm text-gray-700">
                    {JSON.parse(response.value).Value}
                  </p>
                </div>
              ))}
            {questionData.responses.length > 10 && (
              <p className="text-sm text-gray-500 text-center">
                ... và {questionData.responses.length - 10} phản hồi khác
              </p>
            )}
          </div>
        );

      case 6:
        // Stacked Bar Chart for Rating Questions
        return (
          <div className="space-y-6">
            <div className="flex justify-center items-end gap-6 min-h-[250px]">
              {questionData.ratings.map((rating: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-lg font-bold mb-2">{rating.value}</div>
                  <div className="w-10 h-48 bg-gray-200 rounded-lg flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-yellow-400 to-blue-600"
                      style={{
                        height: `${rating.percentage}%`,
                        transition: "height 0.3s ease",
                      }}
                    />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium">
                      {rating.percentage}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {rating.count} phiếu
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        // Stacked Bar Chart for Ranking Questions
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {questionData.options.map((option: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-right truncate">
                    {option.optionContent}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full flex items-center justify-start pl-2"
                        style={{
                          width: `${Math.max(option.percentage, 10)}%`,
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {option.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-600">
                      Rank {option.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const getQuestionTypeName = (type: number) => {
    switch (type) {
      case 1:
        return "Single Choice";
      case 2:
        return "Multiple Choice";
      case 3:
        return "Single Slider";
      case 4:
        return "Range Slider";
      case 5:
        return "Text Input";
      case 6:
        return "Rating";
      case 7:
        return "Ranking";
      default:
        return "Unknown";
    }
  };

  if (!preparedData || preparedData.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500 text-lg">
          Không có dữ liệu phản hồi để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {preparedData.map((questionData, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">
                {questionData.content}
              </CardTitle>
              <Badge variant="secondary">
                {getQuestionTypeName(questionData.type)}
              </Badge>
            </div>
            <div className="w-full flex items-center justify-start">
              <p className="text-sm text-cyan-700">
                Phản hồi: <strong>{questionData.totalResponses}</strong>
              </p>
            </div>
          </CardHeader>
          <CardContent>{renderChart(questionData)}</CardContent>
        </Card>
      ))}
    </div>
  );
};
