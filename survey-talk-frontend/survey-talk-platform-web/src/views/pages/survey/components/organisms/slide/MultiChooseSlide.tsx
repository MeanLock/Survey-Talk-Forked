import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
// import Error from "./Error";
import { handleUpdateMutilChoice } from "@/app/appSlice";
import { HiddenCheck } from "../../molecules/hiddenCheck/HiddenCheck";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const MultiChooseSlide = ({ data }: Props) => {
  const config = useAppSelector((state) => state.appSlice.infoSurvey);
  const isValid = useAppSelector((state) => state.appSlice.isValid);

  const dispatch = useAppDispatch();
  const idsSelected = useMemo(
    () => data?.ValueJson?.QuestionResponse?.MultipleChoice || [],
    [data]
  );
  // const isValid = useMemo(() => data?.IsValid, [data]);
  const handleSelect = useCallback(
    (id: string) => {
      if (isValid) return;
      dispatch(
        handleUpdateMutilChoice({
          idChoose: id,
          questionId: data?.ValueJson?.QuestionContent?.Id || 0,
        })
      );
    },
    [data?.ValueJson?.QuestionContent?.Id, dispatch]
  );

  return (
    <div className="flex flex-col gap-4 w-[90%] max-w-5xl mx-auto mt-6">
      {/* {!isValid ? (
                <Error message="Câu hỏi này chưa được trả lời" />
            ) : null} */}
      {(data?.ValueJson?.QuestionContent?.Options || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (op: any) => (
          <div className="flex justify-center items-center gap-5 w-[100%]">
            {op?.MainImageUrl && !op.MainImageUrl.includes("unknown.jpg") ? (
              <img
                alt="image"
                src={op?.MainImageUrl}
                className="w-[100px] object-contain"
              />
            ) : null}

            <button
              key={op?.Id}
              disabled={isValid}
              onClick={() => handleSelect(op?.Id || 0)}
              className={`text-left px-5 py-2 rounded transition-all duration-150 font-medium text-lg flex-1 ${
                isValid && "opacity-[0.6] cursor-not-allowed"
              }
                        ${
                          idsSelected.includes(op?.Id)
                  ? "text-white border-none"
                  : "bg-transparent text-white border border-white"
                }
                    `}
              style={{
                background: idsSelected.includes(op?.Id)
                  ? config?.ConfigJson?.ButtonBackgroundColor || "#24738a"
                  : "transparent",
                color: idsSelected.includes(op?.Id)
                  ? config?.ConfigJson?.ButtonContentColor || "#ffffff"
                  : config?.ConfigJson?.ContentColor || "#000",
              }}
            >
              {op.Content}
            </button>
          </div>
        )
      )}

      <HiddenCheck id={data?.ValueJson.QuestionContent.QuestionTypeId} />
    </div>
  );
};

export default MultiChooseSlide;
