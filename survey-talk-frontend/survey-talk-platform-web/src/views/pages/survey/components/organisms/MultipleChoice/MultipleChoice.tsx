import "./styles.scss";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  OptionType,
  QuestionType,
  SurveyType,
} from "@/core/types/tools";
/* eslint-enable @typescript-eslint/no-unused-vars */
import ButtonAddAnswer from "../../molecules/buttons/ButtonAddAnswer";
import Answer from "../../molecules/answer/Answer";
import { answerDefault } from "../../../constants/questions";
import { useEffect } from "react";
import { generateUUID } from "@/core/utils/uuid.util";

type Props = {
  formData: SurveyType;
  question: QuestionType;
  handleUpdateQuestion: (
    key: keyof QuestionType,
    value:
      | string
      | number
      | boolean
      | OptionType[]
      | Record<string, string | number>
  ) => void;
};

const MultipleChoice = ({
  question,
  handleUpdateQuestion,
  formData,
}: Props) => {
  useEffect(() => {
    if (!question?.Options?.length) {
      handleUpdateQuestion("Options", [{ ...answerDefault,Id: generateUUID(), Order: 1 }]);
    }
  }, [question]);

  const handleUpdateOption = (updatedOption: OptionType) => {
    const updatedOptions = question.Options.map((option: any) =>
      option.Order === updatedOption.Order ? updatedOption : option
    );
    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleDeleteOption = (orderToDelete: number) => {
    const updatedOptions = question.Options.filter(
      (option: any) => option.Order !== orderToDelete
    );
    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleAddAnswer = () => {
    const newOrder =
      question.Options.length > 0
        ? Math.max(...question.Options.map((o: any) => o.Order)) + 1
        : 1;
    const newOption = { ...answerDefault,Id: generateUUID(), Order: newOrder };
    const updatedOptions = [...question.Options, newOption];
    handleUpdateQuestion("Options", updatedOptions);
  };

  return (
    <div className="multiple-choice flex flex-col gap-2">
      {question?.Options?.length
        ? question.Options.map((item: any) => {
            return (
              <Answer
                data={item}
                key={item.Order}
                handleUpdateOption={handleUpdateOption}
                handleDeleteOption={handleDeleteOption}
                isDisableClose={false}
                formData={formData}
              />
            );
          })
        : null}
      <ButtonAddAnswer onClick={handleAddAnswer} />
    </div>
  );
};

export default MultipleChoice;
