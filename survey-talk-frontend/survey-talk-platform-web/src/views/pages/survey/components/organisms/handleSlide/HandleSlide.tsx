/* eslint-disable @typescript-eslint/no-explicit-any */
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { handleSetIsValid, setSurveyData } from "@/app/appSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { routesMap } from "../../../routes/routes";
import type { SurveyType } from "@/core/types/tools";
import Action from "../../molecules/action/Action";
import Slide from "../slide/Slide";
import "./styles.scss";
import { useUpdateSurveyPro } from "@/services/CreateSurveyTool/EditSession/update-survey-pro";
import { v4 as uuidv4 } from "uuid";
import { NextButton } from "../../atoms/Buttons/NextButton";

type JumpLogic = {
  Conditions: {
    QuestionId: number;
    Conjunction: "AND" | "OR" | null;
    Operator: string;
    OptionId: number;
    CompareValue: number;
  }[];
  TargetQuestionId: number;
};

type Props = {
  dataResponse: SurveyType | null;
  setIsRefetch: Dispatch<SetStateAction<boolean>>;
};

const HandleSlide = ({ dataResponse, setIsRefetch }: Props) => {
  const [current, setCurrent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const taken_subject = useMemo(
    () => searchParams.get("taking_subject"),
    [searchParams]
  );


  const surveyData = useAppSelector((state) => state.appSlice.surveyData);
  console.log("surveyData", surveyData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate } = useUpdateSurveyPro({
    mutationConfig: {
      onSuccess() { },
    },
  });

  const handleNext = useCallback(() => {
    dispatch(handleSetIsValid(true));

    if (Math.random() * 1000 > 900) {
      setIsRefetch((prev) => !prev);
    }

    if (!surveyData?.SurveyResponses) return;

    const question = surveyData?.SurveyResponses[currentIndex];

    // if (!question?.IsValid) return;

    const configJson = question?.ValueJson?.QuestionContent
      ?.ConfigJson as Record<string, any>;
    const jump: JumpLogic[] = (configJson?.JumpLogics || []) as JumpLogic[];

    if (jump.length) {
      for (const logic of jump) {
        let result: boolean | null = null;

        for (let i = 0; i < logic.Conditions.length; i++) {
          const cond = logic.Conditions[i];

          const q = surveyData.SurveyResponses.find(
            (item) => item.ValueJson.QuestionContent.Id === cond.QuestionId
          );
          const questionResponse = q?.ValueJson?.QuestionResponse as Record<
            string,
            any
          >;

          let isValid = false;

          if (
            q?.ValueJson.QuestionContent.QuestionTypeId === 1 ||
            q?.ValueJson.QuestionContent.QuestionTypeId === 2
          ) {
            const selected = questionResponse?.SingleChoice;
            if (cond.Operator === "Chọn") {
              isValid = selected === cond.OptionId;
            }
            if (cond.Operator === "Không Chọn") {
              isValid = selected !== cond.OptionId;
            }
          }

          if (q?.ValueJson.QuestionContent.QuestionTypeId === 6) {
            const value = questionResponse?.Input?.Value;
            if (cond.Operator === "=") {
              isValid = value === cond.CompareValue;
            }
            if (cond.Operator === ">=") {
              isValid = value >= cond.CompareValue;
            }
            if (cond.Operator === "<=") {
              isValid = value <= cond.CompareValue;
            }
            if (cond.Operator === ">") {
              isValid = value > cond.CompareValue;
            }
            if (cond.Operator === "<") {
              isValid = value < cond.CompareValue;
            }
          }

          if (i === 0) {
            result = isValid;
          } else {
            if (cond.Conjunction === "AND") {
              result = result && isValid;
            } else if (cond.Conjunction === "OR") {
              result = result || isValid;
            } else {
              result = result && isValid;
            }
          }
        }

        if (result) {
          let targetIndex = -1;
          for (let i = surveyData.SurveyResponses.length - 1; i >= 0; i--) {
            if (
              surveyData.SurveyResponses[i].ValueJson.QuestionContent.Id ===
              logic.TargetQuestionId
            ) {
              targetIndex = i;
              break;
            }
          }

          if (targetIndex !== -1) {
            const target = surveyData.SurveyResponses[targetIndex];
            setCurrent(target.ValueJson.QuestionContent.Id);
            setCurrentIndex(targetIndex);
            return;
          }
        }
      }
    }

    if (
      currentIndex === -1 ||
      currentIndex === surveyData.SurveyResponses.length - 1
    )
      return;

    const nextIndex = currentIndex + 1;
    const nextQuestion = surveyData.SurveyResponses[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrent(nextQuestion?.ValueJson?.QuestionContent?.Id ?? 0);
  }, [surveyData, currentIndex]);

  const handleEnd = useCallback(() => {
    if (!surveyData || !id) return;
    const dataBuider = {
      ...surveyData,
      surveyId: id,
      taken_subject: taken_subject,
      SurveyResponses: surveyData?.SurveyResponses?.filter(
        (i) => !i.parentId
      ).map((i) => ({
        IsValid: i.IsValid,
        ValueJson: {
          ...i.ValueJson,
          QuestionContent: {
            Id: i.ValueJson.QuestionContent.Id,
            MainImageUrl: i.ValueJson.QuestionContent.MainImageUrl || null,
            QuestionTypeId: i.ValueJson.QuestionContent.QuestionTypeId,
            Content: i.ValueJson.QuestionContent.Content,
            Description: i.ValueJson.QuestionContent.Description,
            ConfigJson: (() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { JumpLogics, ...rest } = (i.ValueJson.QuestionContent
                .ConfigJson || {}) as {
                  [key: string]: any;
                };
              return rest;
            })(),
            Options: i.ValueJson.QuestionContent.Options,
          },
        },
      })),
    };
    if (taken_subject === "Preview") {
      navigate(routesMap.EndSurveyCustomer.replace("/:id/end", `/${id}/end`));
      return;
    }
    mutate(dataBuider);
    navigate(routesMap.EndSurveyCustomer.replace("/:id/end", `/${id}/end`)); // Thịnh, đổi đường dẫn từ /survey/end/:id sang /survey/:id/end
  }, [id, mutate, navigate, surveyData, taken_subject]);

  if (!surveyData?.SurveyResponses?.length) {
    return (
      <Start
        dataResponse={dataResponse}
        setCurrent={setCurrent}
        setCurrentIndex={setCurrentIndex}
      />
    );
  }

  return (
    <div className="w-[60%]">
      <Slide currentQuestionId={current} />
      <Action
        onNext={handleNext}
        currentIndex={currentIndex}
        onEnd={handleEnd}
      />
    </div>
  );
};

export default HandleSlide;

const Start = ({
  dataResponse,
  setCurrent,
  setCurrentIndex,
}: {
  dataResponse: SurveyType | null;
  setCurrent: Dispatch<SetStateAction<number>>;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}) => {
  const data = useAppSelector((state) => state.appSlice.infoSurvey);
  const dispatch = useAppDispatch();

  const buttonBgColor = useMemo(
    () => data?.ConfigJson?.ButtonBackgroundColor || "#007bff",
    [data?.ConfigJson?.ButtonBackgroundColor]
  );
  const buttonTextColor = useMemo(
    () => data?.ConfigJson?.ButtonContentColor || "#ffffff",
    [data?.ConfigJson?.ButtonContentColor]
  );

  const handleStart = () => {
    if (dataResponse) {
      let dataStore = (dataResponse?.Questions || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => ({
          isEnd: false,
          isNext: false,
          IsValid: true,
          ValueJson: {
            QuestionContent: {
              Id: i?.Id || null,
              MainImageUrl: i?.MainImageUrl || "",
              QuestionTypeId: i?.QuestionTypeId || 0,
              Content: i?.Content || "",
              Description: i?.Description || "",
              ConfigJson: i?.ConfigJson || {},
              Options: i?.Options || [],
              TimeLimit: i?.TimeLimit || 0,
              ...(i?.IsVoiced && {
                SpeechText: i?.SpeechText || "",
              }),
              IsVoiced: i?.IsVoiced || false,
            },
            QuestionResponse: {
              Input: null,
              Range: null,
              Ranking: null,
              SingleChoice: null,
              MultipleChoice: null,
              SpeechText: null,
            },
          },
        })
      );

      if (dataStore.length > 5) {
        const duplicateCount = Math.floor(dataStore.length * 0.2);
        const getRandomUniqueIndices = (maxIndex: number, count: number) => {
          const indices = new Set<number>();
          while (indices.size < count && indices.size < maxIndex) {
            indices.add(Math.floor(Math.random() * maxIndex));
          }
          return Array.from(indices);
        };
        const duplicateIndices = getRandomUniqueIndices(
          dataStore.length,
          duplicateCount
        );

        const duplicatedItems = duplicateIndices.map(
          (index) => dataStore[index]
        );
        const newData = duplicatedItems.map((i, indexChild) => {
          if (indexChild === duplicatedItems.length - 1) {
            return {
              ...i,
              parentId: i?.ValueJson?.QuestionContent?.Id,
              isUnPost: true,
              isEnd: true,
              ValueJson: {
                ...i.ValueJson,
                QuestionContent: {
                  ...i?.ValueJson?.QuestionContent,
                  Id: uuidv4(),
                },
              },
            };
          }
          return i;
        });
        dataStore = [...dataStore, ...newData];
      }
      console.log("dataStore >>>", dataStore);
      // Set isEnd: true for the last question of the entire survey
      if (dataStore.length > 0) {
        dataStore[dataStore.length - 1] = {
          ...dataStore[dataStore.length - 1],
          isEnd: true,
        };
      }

      dispatch(
        setSurveyData({
          taken_subject: "Preview",
          InvalidReason: "",
          SurveyResponses: dataStore,
        })
      );
      if (dataResponse?.Questions?.length && dataResponse?.Questions[0]?.Id) {
        setCurrent(dataResponse?.Questions[0]?.Id);
        setCurrentIndex(0);
      }
    }
  };
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="w-1/2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
        <p
          className="text-[32px] text-center font-bold"
          style={{ color: data?.ConfigJson?.TitleColor || "#FFFFFF" }}
        >
          {data?.Title}
        </p>
      </div>
      <div className="w-8/12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
        <p
          style={{ color: data?.ConfigJson?.ContentColor || "#CCCCCC" }}
          className="text-[20px] text-center"
        >
          {data?.Description}
        </p>
      </div>

      {/* <button
        onClick={handleStart}
        className="startpage-btn group cursor-pointer"
        style={{
          background:
            buttonBgColor?.startsWith("linear-gradient") ||
            buttonBgColor?.startsWith("radial-gradient")
              ? buttonBgColor
              : "",
          backgroundColor: !(
            buttonBgColor?.startsWith("linear-gradient") ||
            buttonBgColor?.startsWith("radial-gradient")
          )
            ? buttonBgColor
            : "",
          color: buttonTextColor,
        }}
      >
        <span>Bắt đầu</span>
        <span className="startpage-icon-wrapper">
          <ChevronRightIcon />
        </span>
      </button> */}

      <div onClick={handleStart} className="flex items-center justify-center">
        <NextButton
          {...(() => {
            if (buttonBgColor.startsWith("linear-gradient")) {
              // dùng regex tách màu
              const matches = buttonBgColor.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
              return {
                bgColor1: matches?.[0] || "#ffffff",
                bgColor2: matches?.[1] || null,
              };
            } else {
              return {
                bgColor1: buttonBgColor,
                bgColor2: null,
              };
            }
          })()}
          textColor={buttonTextColor}
          label="Bắt Đầu"
        />
      </div>
    </div>
  );
};
