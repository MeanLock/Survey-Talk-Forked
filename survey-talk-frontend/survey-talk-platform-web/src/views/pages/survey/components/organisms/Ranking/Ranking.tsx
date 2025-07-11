import { useEffect } from "react";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  OptionType,
  QuestionType,
  SurveyType,
} from "@/core/types/tools";
/* eslint-enable @typescript-eslint/no-unused-vars */
import ButtonAddAnswer from "../../molecules/buttons/ButtonAddAnswer";
import "./styles.scss";
import { answerDefault } from "../../../constants/questions";
import Answer from "../../molecules/answer/Answer";

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

const Ranking = ({ question, handleUpdateQuestion, formData }: Props) => {
  useEffect(() => {
    if (!question?.Options?.length) {
      handleUpdateQuestion("Options", [{ ...answerDefault, Order: 1 }]);
    }
  }, [question, handleUpdateQuestion]);

  const handleUpdateOption = (updatedOption: OptionType) => {
    const updatedOptions = (question?.Options || []).map((option) =>
      option.Order === updatedOption.Order ? updatedOption : option
    );
    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleDeleteOption = (orderToDelete: number) => {
    const updatedOptions = (question?.Options || []).filter(
      (option: any) => option.Order !== orderToDelete
    );

    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleAddAnswer = () => {
    const newOrder = question?.Options?.length
      ? Math.max(...question.Options.map((o) => o.Order)) + 1
      : 1;
    const newOption = { ...answerDefault, Order: newOrder };
    const updatedOptions = [...(question?.Options || []), newOption];
    handleUpdateQuestion("Options", updatedOptions);
  };

  return (
    <div className="ranking flex flex-col gap-2">
      {question?.Options?.length
        ? question.Options.map((item) => {
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

export default Ranking;
